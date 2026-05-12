import { Avatar, ChordIcon, Divider, Tag, TopNavigation } from "@chord-ds/components";
import styles from "./index.module.css";

const FEED_CARDS = [
  {
    name: "Jenrubyjane",
    group: "BLACKPINK",
    text: "안녕! 이번 주는 다들 어떻게 지냈나요? 오늘은 아파트 404가 공개되는 날이에요. 저는 걱정 반 설렘 반으로 첫 방송을 기다리고 있어요.",
    imageHeight: 476,
  },
  {
    name: "Rosieposie",
    group: "BLACKPINK",
    text: "여러분! 블핑이가 8살 돼쩌요🫣 올해두 블링꾸랑 같이 축하할수있어서 너무 좋고 행복합니다🫶🏻 오래오래 계속 함께 해줘요 블링크!",
    imageHeight: 295,
  },
  {
    name: "Rosieposie",
    group: "BLACKPINK",
    text: "블핑은 8살 🖤🩷",
    imageHeight: 200,
  },
] as const;

export default function MyFeedScreen() {
  return (
    <div className={styles.screen}>
      {/* ── Navigation Bar ── */}
      <header className={styles.navBar}>
        {/* Status_bar: 모바일 OS 전용, 웹에서는 spacer로 대체 */}
        <div className={styles.statusSpacer} />
        <TopNavigation
          textType="logo-svg"
          scrollBg="on"
          mode="default"
          showLeading={false}
          showTrailing
          trailingCount="2ea"
          logoSlot={
            /* TODO: weverse 로고 에셋 → 라이브러리 추가 필요 */
            <span className={styles.logoPlaceholder}>weverse</span>
          }
          trailingSlots={[
            /* TODO(icon): figma "ic_wev_ai_special_medium" → chord-icons.tsx 등록 필요 */
            <ChordIcon key="ai" name="nullMedium" />,
            /* TODO(icon): figma "ic_notification_medium" → chord-icons.tsx 등록 필요 */
            <ChordIcon key="bell" name="nullMedium" />,
          ]}
        />
      </header>

      {/* ── Tabs ── */}
      <div className={styles.tabsBar}>
        <button className={`${styles.tab} ${styles.tabActive}`} type="button">
          My Feed
        </button>
        <button className={styles.tab} type="button">
          Discover
        </button>
        <button className={`${styles.tab} ${styles.logoTab}`} type="button">
          {/* TODO: weverse 로고 에셋 */}
          w
        </button>
        <button className={styles.tab} type="button">
          Spot
        </button>
      </div>

      {/* ── Content ── */}
      <main className={styles.content}>
        {/* On Live */}
        <section className={styles.section}>
          <div className={styles.liveCard}>
            <div className={styles.liveHeader}>
              <div className={styles.liveBadge}>LIVE</div>
              <div className={styles.videoArea}>
                <div className={styles.videoSlot} />
                <div className={styles.videoSlot} />
              </div>
            </div>
            <div className={styles.liveBottom}>
              <div className={styles.liveArtistRow}>
                <div className={styles.liveAvatarStack}>
                  <Avatar size="tiny" />
                  <Avatar size="tiny" />
                </div>
                <span className={styles.artistName}>
                  TXT <span className={styles.dot}>·</span> YEONJUN
                </span>
              </div>
            </div>
            <p className={styles.liveTitle}>Let's chat together 🌙</p>
            <div className={styles.liveStats}>
              <span>재생 324K</span>
              <span className={styles.dot}>·</span>
              <span>좋아요 1.1B</span>
              <span className={styles.dot}>·</span>
              <span>채팅 123M</span>
              <Tag
                color="secondary-blue"
                size="small"
                tagType="fill"
                shape="round"
                label="LIVE"
              />
            </div>
          </div>
        </section>

        {/* AI Banner */}
        <section className={styles.section}>
          {/* TODO: AI Banner — 앱 고유 컴포넌트, 라이브러리 미포함 */}
          <div className={styles.aiBannerPlaceholder}>AI Banner</div>
        </section>

        {/* Common_Slot */}
        <section className={styles.section}>
          <div className={styles.commonSlotPlaceholder} />
        </section>

        {/* DM section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>ON LIVE</h2>
          </div>
          <div className={styles.dmCard}>
            <Avatar size="medium" />
            <div className={styles.dmContent}>
              <p className={styles.dmTitle}>아티스트 DM</p>
              {/* TODO: 말풍선(Bubble) — 앱 고유 컴포넌트, 라이브러리 미포함 */}
              <div className={styles.bubblePlaceholder} />
            </div>
          </div>
        </section>

        {/* 최신 Notice */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>최신 Notice</h2>
          </div>
          <div className={styles.noticeCard}>
            <Avatar size="large" mode="default" />
            <div className={styles.noticeContent}>
              <div className={styles.noticeMain}>
                <span className={styles.noticeArtist}>TOMORROW X TOGETHER</span>
                <span className={styles.noticeTime}>2시간 전</span>
              </div>
              <p className={styles.noticeSub}>
                [NOTICE] TOMORROW X TOGETHER '2026 TXT MOA CON' - 공식 상품 현장 판매 및 부스 운영 안내드립
              </p>
            </div>
          </div>
        </section>

        {/* AI 검색 */}
        <section className={styles.section}>
          {/* TODO: AI Banner — 앱 고유 컴포넌트, 라이브러리 미포함 */}
          <div className={styles.aiBannerPlaceholder}>AI 검색</div>
        </section>

        {/* Feed card: YEONJUN */}
        <section className={styles.section}>
          <div className={styles.feedCard}>
            <div className={styles.feedCardTop}>
              <Avatar size="small" />
              <div className={styles.feedUserInfo}>
                <div className={styles.feedUserName}>TXT_YEONJUN</div>
                <div className={styles.feedUserMeta}>
                  <span>·</span>
                  <span>01.26. 10:20</span>
                </div>
              </div>
            </div>
            <div className={styles.feedCardBody}>
              <p>모아가 좋아할 것 같아서 찍어왔다요 잘했지😊</p>
              <div className={styles.translateLink}>번역 보기</div>
              {/* TODO: ImageGrid — 앱 고유 컴포넌트, 라이브러리 미포함 */}
              <div className={styles.imageGridPlaceholder} />
            </div>
            <div className={styles.feedCardBottom}>
              <Divider height="1" mode="default" />
              <div className={styles.feedActions}>
                <span>♥ 10K+</span>
                <span>💬 4,567</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feed card: English post */}
        <section className={styles.section}>
          <div className={styles.feedCard}>
            <div className={styles.feedCardTop}>
              <Avatar size="small" />
              <div className={styles.feedUserInfo}>
                <div className={styles.feedUserName}>Your_Home_숩</div>
              </div>
            </div>
            <div className={styles.feedCardBody}>
              <p>
                We finally made a comeback!!!!!!! In fact, I was happy to see so many MOA that we
                didn't feel like a period of inactivity :)
              </p>
              <div className={styles.translateLink}>번역보기</div>
              <div className={styles.imageGridPlaceholder} style={{ height: 372 }} />
            </div>
            <div className={styles.feedCardBottom}>
              <Divider height="1" mode="default" />
              <div className={styles.feedStats}>
                <span>재생</span>
                <span className={styles.dot}>·</span>
                <span>좋아요</span>
                <span className={styles.dot}>·</span>
                <span>댓글</span>
              </div>
            </div>
          </div>
        </section>

        {/* AD */}
        <section className={styles.section}>
          <div className={styles.adCard}>
            <div className={styles.adImagePlaceholder} />
            <div className={styles.adBottom}>
              <Avatar size="xsmall" />
              <div>
                <div className={styles.feedUserName}>alo</div>
                <div className={styles.adTag}>AD</div>
              </div>
            </div>
            <Divider height="1" mode="default" />
            <p className={styles.adText}>
              지수의 컬러로 물든 알로 선셋 스니커즈 스페셜 에디션, 일상과 운동 어떤 순간에도 자연스러운
              코디를 완성해 보세요.
            </p>
          </div>
        </section>

        {/* Feed cards: BLACKPINK members */}
        {FEED_CARDS.map((card, i) => (
          <section key={i} className={styles.section}>
            <div className={styles.feedCard}>
              <div className={styles.feedCardTop}>
                <Avatar size="small" />
                <div className={styles.feedUserInfo}>
                  <div className={styles.feedUserName}>{card.name}</div>
                  <div className={styles.feedUserMeta}>
                    <span>{card.group}</span>
                    <span className={styles.dot}>·</span>
                    <span>01.26. 10:20</span>
                  </div>
                </div>
              </div>
              <div className={styles.feedCardBody}>
                <p>{card.text}</p>
                <div className={styles.translateLink}>번역 보기</div>
                <div
                  className={styles.imageGridPlaceholder}
                  style={{ height: card.imageHeight }}
                />
              </div>
              <div className={styles.feedCardBottom}>
                <Divider height="1" mode="default" />
                <div className={styles.feedActions}>
                  <span>♥ 10K+</span>
                  <span>💬 4,567</span>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Common_Slot bottom */}
        <section className={styles.section}>
          <div className={styles.commonSlotPlaceholder} style={{ height: 631 }} />
        </section>
      </main>

      {/* Bottom Navigation */}
      <footer className={styles.bottomNav}>
        {/* TODO: BottomNavigation — 앱 고유 컴포넌트, 라이브러리 미포함 */}
        <div className={styles.bottomNavPlaceholder} />
      </footer>
    </div>
  );
}
