const generateConfigFull = {
    fullPackageJsonConfig: true,
    accompanyingFiles: true,
    textInAccompanyingFiles: true,
    license: true,
    runtime: true,
    editor: true,
    tests: true,
    samples: true,
    exampleCode: true,
}

const generateConfigEssential = {
    fullPackageJsonConfig: false,
    accompanyingFiles: false,
    textInAccompanyingFiles: false,
    license: false,
    runtime: false,
    editor: false,
    tests: false,
    samples: false,
    exampleCode: false,
}

const fileMap = {
    essential: [
        "package.json",
        "package.json.meta"
    ],
    accompanyingFiles: [
        "CHANGELOG.md",
        "README.md",
        "Documentation~/<%= name %>.md",
    ],
    runtime: [
        "Runtime/Unity.<%= name %>.asmdef",
    ],
    editor: [
        "Editor/Unity.<%= name %>.Editor.asmdef",
    ],
    tests: [
        "Tests/Runtime/Unity.<%= name %>.Tests.asmdef",
        "Tests/Editor/Unity.<%= name %>.Editor.Tests.asmdef",
    ],
    samples: [
        "Samples~/ExampleSample/ExampleScene.unity",
        "Samples~/ExampleSample/Example.prefab",
    ],
    exampleCode: {
        tests: [
            "Tests/Runtime/ExampleTest.cs",
            "Tests/Editor/ExampleEditorTest.cs"
        ],
        runtime: [
            "Runtime/ExampleScript.cs"
        ],
        editor: [
            "Editor/ExampleScriptEditor.cs"
        ]
    },
    templateFilenames:
    [
        "Documentation~/<%= name %>.md",
        "Runtime/Unity.<%= name %>.asmdef",
        "Editor/Unity.<%= name %>.Editor.asmdef",
        "Tests/Runtime/Unity.<%= name %>.Tests.asmdef",
        "Tests/Editor/Unity.<%= name %>.Editor.Tests.asmdef",
    ]
}

module.exports = {
    generateConfigFull,
    generateConfigEssential,
    fileMap
}