// swift-tools-version: 6.1

import PackageDescription

let package = Package(
  name: "SwiftUIPreviewTest",
  platforms: [
    .iOS(.v17),
    .macOS(.v14),
  ],
  products: [
    .library(
      name: "SwiftUIPreviewTest",
      targets: ["SwiftUIPreviewTest"]
    ),
    .executable(
      name: "FigmaHarnessCLI",
      targets: ["FigmaHarnessCLI"]
    ),
  ],
  targets: [
    .target(
      name: "SwiftUIPreviewTest",
      resources: [
        .process("Resources"),
      ]
    ),
    .executableTarget(
      name: "FigmaHarnessCLI",
      dependencies: ["SwiftUIPreviewTest"]
    ),
    .testTarget(
      name: "SwiftUIPreviewTestTests",
      dependencies: ["SwiftUIPreviewTest"]
    ),
  ]
)
