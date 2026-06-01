import StyleSheetMap from "../src/index";
import "./CSSStyleSheet.mock";

describe("basic tests", () => {
  let onCreatedSheet: CSSStyleSheet;
  const sheet = new StyleSheetMap({
    onCreated: (sheet) => {
      onCreatedSheet = sheet;
    },
  });

  test("should create an empty StyleSheetMap", () => {
    expect(sheet.size).toBe(0);
    expect(sheet.styleSheet).toBeUndefined();
  });

  test("should create StyleSheet and add rules", () => {
    sheet.set("key1", "body { background-color: red; }");
    expect(sheet.size).toBe(1);
    expect(sheet.styleSheet?.cssRules.length).toBe(1);
    expect(sheet.styleSheet?.cssRules[0].cssText).toBe(
      "body { background-color: red; }"
    );
    expect(onCreatedSheet).toBeDefined();
    expect(onCreatedSheet).toEqual(sheet.styleSheet);
  });

  test("should delete rule by key", () => {
    sheet.set("key1", "body { background-color: red; }");
    sheet.delete("key1");
    expect(sheet.size).toBe(0);
    expect(sheet.styleSheet?.cssRules.length).toBe(0);
  });

  test("should handle disabling and enabling the stylesheet", () => {
    sheet.set("key1", "body { background-color: red; }");
    sheet.disabled = true;
    expect(sheet.disabled).toBe(true);
    expect(sheet.styleSheet?.disabled).toBe(true);
    sheet.disabled = false;
    expect(sheet.disabled).toBe(false);
    expect(sheet.styleSheet?.disabled).toBe(false);
  });

  test("should create StyleSheet with initial options and rules", () => {
    const options = {
      rules: [["key1", "body { background-color: red; }"]] as const,
      onCreated: (createdSheet: CSSStyleSheet) => {
        expect(createdSheet).toBeInstanceOf(CSSStyleSheet);
      },
    };
    const sheetWithOptions = new StyleSheetMap(options);
    expect(sheetWithOptions.size).toBe(1);
    expect(sheetWithOptions.styleSheet?.cssRules.length).toBe(1);
    expect(sheetWithOptions.styleSheet?.cssRules[0].cssText).toBe(
      "body { background-color: red; }"
    );
  });

  test("should not create a new StyleSheet if one already exists", () => {
    sheet.set("key1", "body { background-color: red; }");
    const initialSheet = sheet.styleSheet;
    const newSheet = sheet.createSheet();
    expect(newSheet).toBe(initialSheet);
  });

  test("should handle multiple updates to the same key and multiple keys", () => {
    // Set initial rules for multiple keys
    sheet.set("key1", "body { background-color: red; }");
    sheet.set("key2", "h1 { color: blue; }");
    sheet.set("key3", "p { font-size: 16px; }");

    // Verify initial state
    expect(sheet.size).toBe(3);
    expect(sheet.get("key1")?.cssText).toBe("body { background-color: red; }");
    expect(sheet.get("key2")?.cssText).toBe("h1 { color: blue; }");
    expect(sheet.get("key3")?.cssText).toBe("p { font-size: 16px; }");

    // Update rules for 'key1' multiple times
    sheet.set("key1", "body { background-color: green; }");
    expect(sheet.get("key1")?.cssText).toBe("body { background-color: green; }");

    sheet.set("key1", "body { background-color: blue; }");
    expect(sheet.get("key1")?.cssText).toBe("body { background-color: blue; }");

    // Update rules for 'key2'
    sheet.set("key2", "h1 { color: red; }");
    expect(sheet.get("key2")?.cssText).toBe("h1 { color: red; }");

    // Verify deletion of 'key2'
    sheet.delete("key2");
    expect(sheet.size).toBe(2);
    expect(sheet.get("key1")?.cssText).toBe("body { background-color: blue; }");
    expect(sheet.get("key3")?.cssText).toBe("p { font-size: 16px; }");
  });
});
