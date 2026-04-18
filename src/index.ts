/**
 * Copyright (c) 2024 HuanYang. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

interface Options<Key = unknown> extends CSSStyleSheetInit {
  rules?: readonly (readonly [Key, string])[] | null;
  onCreated?: (sheet: CSSStyleSheet) => void;
}

class StyleSheetMap<Key = unknown> extends Map<Key, CSSRule> {
  public styleSheet?: CSSStyleSheet;
  public onCreatedSheet?: (sheet: CSSStyleSheet) => void;
  private styleSheetInit?: CSSStyleSheetInit;
  constructor(options: Options<Key> = {}) {
    super();
    const { onCreated, rules, ...init } = options;
    this.onCreatedSheet = onCreated;
    this.styleSheetInit = init;

    if (rules && rules.length > 0) {
      this.styleSheet = this.createSheet();
      for (let [k, v] of rules) {
        const index = this.styleSheet.insertRule(v, this.styleSheet.cssRules.length);
        const rule = this.styleSheet.cssRules[index];
        super.set(k, rule);
      }
    }
  }

  // key to index
  private getIndex(key: Key): number {
    const rule = super.get(key);
    if (!rule || !this.styleSheet) return -1;
    const cssRules = this.styleSheet.cssRules;
    for (let i = cssRules.length - 1; i >= 0; i--) {
      if (cssRules[i] === rule) return i;
    }
    return -1;
  }

  // @ts-expect-error - intentionally override Map's set to accept CSS text
  public set(key: Key, value: string): this {
    if (!this.styleSheet) {
      this.styleSheet = this.createSheet();
    }

    let index = this.getIndex(key);
    if (index !== -1) {
      this.styleSheet.deleteRule(index);
    } else {
      index = this.styleSheet.cssRules.length;
    }
    index = this.styleSheet.insertRule(value, index);
    const rule = this.styleSheet.cssRules[index];
    return super.set(key, rule);
  }

  public delete(key: Key) {
    let index = this.getIndex(key);
    if (index !== -1 && this.styleSheet) {
      this.styleSheet.deleteRule(index);
    }
    return super.delete(key);
  }

  public clear() {
    if (this.styleSheet) {
      while (this.styleSheet.cssRules.length > 0) {
        this.styleSheet.deleteRule(0);
      }
    }
    super.clear();
  }

  public createSheet(init?: CSSStyleSheetInit) {
    if (this.styleSheet) {
      console.warn("StyleSheetMap already has a styleSheet");
      return this.styleSheet;
    }
    init = init || this.styleSheetInit;
    this.styleSheet = new CSSStyleSheet(init);
    this.onCreatedSheet?.(this.styleSheet);
    return this.styleSheet;
  }

  public get disabled() {
    return this.styleSheet?.disabled || false;
  }

  public set disabled(value: boolean) {
    if (this.styleSheet) {
      this.styleSheet.disabled = value;
    }
  }
}

export default StyleSheetMap;
