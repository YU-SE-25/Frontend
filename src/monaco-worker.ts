// 🎯 MonacoEditor worker 설정 파일
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "cpp") {
      return new Worker(
        new URL(
          "monaco-editor/esm/vs/language/cpp/cpp.worker.js",
          import.meta.url
        ),
        { type: "module" }
      );
    }

    if (label === "java") {
      return new Worker(
        new URL(
          "monaco-editor/esm/vs/language/java/java.worker.js",
          import.meta.url
        ),
        { type: "module" }
      );
    }

    return new Worker(
      new URL("monaco-editor/esm/vs/editor/editor.worker.js", import.meta.url),
      { type: "module" }
    );
  },
};
