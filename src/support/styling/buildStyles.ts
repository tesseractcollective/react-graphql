// import { styleMap as defaultStyles } from "./defaultStyles";

let styleMap: any = {
  // ...defaultStyles,
};

export function registerStyles(newStyles: any) {
  styleMap = {
    ...styleMap,
    ...newStyles,
  };
}

export function buildStyles(namesStr: string): any[] & { single?: any } {
  if (!namesStr || !styleMap) {
    return [];
  }

  //'hel-bold red p-mxx'
  const namesArr = namesStr.trim().split(" ");
  const styles: any[] & { single?: any } = namesArr.map(
    (name: string) => (name && styleMap[name]) || {}
  );
  styles.single = styles.reduce((t, n) => ({ ...t, ...n })) as any[];
  return styles;
}

export const bs = buildStyles;
