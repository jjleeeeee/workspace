#!/usr/bin/env python3

# update-figma-res.py
# * 사용방법
#    ```
#    $ ./update-figma-res
#    ```

import os
import argparse
import time

REQUEST_TIMEOUT_SECONDS = 20
REQUEST_RETRY_COUNT = 3
REQUEST_RETRY_DELAY_SECONDS = 1
WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def load_env_file(filepath):
    if not os.path.exists(filepath):
        return

    with open(filepath, "r", encoding="utf-8") as file:
        for raw_line in file:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip("\"'")

            if key and key not in os.environ:
                os.environ[key] = value


def get_required_env(name):
    load_env_file(os.path.join(WORKSPACE_ROOT, ".env"))
    value = os.environ.get(name, "").strip()
    if not value:
        raise RuntimeError(f"{name} is required. Set it in .env or shell environment.")
    return value

def read_txt_to_list_generator(filepath):
    """
    텍스트 파일을 읽어서 각 줄을 리스트의 요소로 저장합니다.
    제너레이터 표현식과 list()를 사용합니다.

    Args:
        filepath: 텍스트 파일의 경로

    Returns:
        파일의 각 줄을 요소로 갖는 리스트
        파일이 없거나 읽을 수 없는 경우 빈 리스트를 반환합니다.
    """
    my_list = []
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            for line in file:
                line = line.strip()  # 줄의 앞뒤 공백 제거
                if line and not line.startswith('#'):  # 빈 줄이 아니고 #으로 시작하지 않는 경우
                    my_list.append(line)
            return my_list
    except FileNotFoundError:
        print(f"Error: File not found at {filepath}")
        return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return []
token = get_required_env("FIGMA_TOKEN")
file_id="DWEduE6GfxYMlyxKPNJ8jA"
node_id="5:23828"
headers = {'content-type': 'application/json', 'Accept-Charset': 'UTF-8', 'X-FIGMA-TOKEN': f'{token}'}
script_path = os.path.abspath(__file__)
script_dir_path = os.path.dirname(script_path)
icons_path = os.path.abspath(
    os.path.join(script_dir_path, "..", "04_wf-figma-to-react-components", "src", "assets", "icons")
)
ignore_figma_icons = []

def main():
    global ignore_figma_icons

    parser = argparse.ArgumentParser()
    parser.add_argument('--force', action='store_true')
    parser.add_argument('name', nargs='*', help="Resource name to update")
    args = parser.parse_args()
    ignore_figma_icons = read_txt_to_list_generator(f"{script_dir_path}/.figmaignore")
    updateNames = args.name
    forceDownload = args.force
    print(f"updateNames = {updateNames}")
    os.makedirs(icons_path, exist_ok=True)
    print(f"iconsPath = {icons_path}")

    contents_data = request_json(f"https://api.figma.com/v1/files/{file_id}/nodes?ids={node_id}")

    components = contents_data["nodes"][str(node_id)]["components"]
    downloaded_count = downloadSvg(components, forceDownload, updateNames)

    componentSets = contents_data["nodes"][str(node_id)]["componentSets"]
    downloaded_count += downloadSvg(componentSets, forceDownload, updateNames)

    print(f"\nCompleted!! Downloaded {downloaded_count} svg files.")

def request_json(url):
    response = request_with_retry(url, headers=headers)
    return response.json()

def download_file(url, output_path):
    response = request_with_retry(url)
    with open(output_path, "wb") as file:
        file.write(response.content)

def request_with_retry(url, **kwargs):
    import requests

    last_error = None
    for attempt in range(1, REQUEST_RETRY_COUNT + 1):
        try:
            response = requests.get(url, timeout=REQUEST_TIMEOUT_SECONDS, **kwargs)
            response.raise_for_status()
            return response
        except requests.RequestException as error:
            last_error = error
            if attempt == REQUEST_RETRY_COUNT:
                break

            print(f"\nRetry {attempt}/{REQUEST_RETRY_COUNT - 1}: {type(error).__name__}")
            time.sleep(REQUEST_RETRY_DELAY_SECONDS)

    raise last_error

def downloadSvg(components, forceDownload, updateNames):
    assets = [x for x in components if (
            str(components[x]["name"]).startswith("12/") # xxsmall
            or str(components[x]["name"]).startswith("20/") # small
            or str(components[x]["name"]).startswith("24/") # medium
            or str(components[x]["name"]).startswith("32/") # large
            or str(components[x]["name"]).startswith("40/") # xlarge
            or str(components[x]["name"]).startswith("60/") # xxlarge
            or str(components[x]["name"]).startswith("64/") # xxxlarge
            or str(components[x]["name"]).startswith("vector/") # vector image
        )
        # 가이드 아이콘들 제외
        and (not str(components[x]["name"]).endswith("ic_thumbnail_medium"))
        and (not str(components[x]["name"]).find("_null_") >= 0)
        and (not str(components[x]["name"]).find("_test_") >= 0)
        # 뒤에 그림자효과 있는 아이콘 제외
        and (not str(components[x]["name"]).endswith("shadow_medium"))
    ]

    assets_size = len(assets)
    print(f"\ncheck {assets_size} svgs...")
    if assets_size == 0:
        return 0

    ids = ','.join(map(str, assets))
    image_data = request_json(f"https://api.figma.com/v1/images/{file_id}?ids={ids}&format=svg")

    downloaded_count = 0
    for asset in assets:
        filename=str(components[str(asset)]["name"]).split("/")[-1].replace(" ", "_")
        svg_output_path=f"{icons_path}/{filename}.svg"
        image_url = image_data["images"].get(str(asset))
        if image_url is None:
            continue

        if updateNames:
            if filename in updateNames:
                downloaded_count += 1
                print(f"\n{filename}")
                download_file(image_url, svg_output_path)
        else:
            if filename in ignore_figma_icons:
                continue

            if not os.path.exists(svg_output_path) or forceDownload:
                downloaded_count += 1
                print(f"\n{filename}")
                download_file(image_url, svg_output_path)

    return downloaded_count

if __name__=='__main__':
    main()
