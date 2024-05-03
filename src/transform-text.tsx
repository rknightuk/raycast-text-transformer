import { List, ActionPanel, Action, LaunchProps } from "@raycast/api";
import { ReactNode } from "react";

const Actions = function (props: { contents: string, title: string }) {
  return (
    <ActionPanel title={props.title}>
      <ActionPanel.Section>
        <Action.CopyToClipboard content={props.contents} title="Copy" />
      </ActionPanel.Section>
    </ActionPanel>
  );
};

// title case code from https://github.com/blakeembrey/change-case/blob/master/packages/title-case/src/index.ts
const titleCase = (string: string) => {
    const SMALL_WORDS =
      /\b(?:an?d?|a[st]|because|but|by|en|for|i[fn]|neither|nor|o[fnr]|only|over|per|so|some|tha[tn]|the|to|up|upon|vs?\.?|versus|via|when|with|without|yet)\b/i;
    const TOKENS = /[^\s:–—-]+|./g;
    const WHITESPACE = /\s/;
    const IS_MANUAL_CASE = /.(?=[A-Z]|\..)/;
    const ALPHANUMERIC_PATTERN = /[A-Za-z0-9\u00C0-\u00FF]/;
  
    let result = "";
    let m;
  
    while ((m = TOKENS.exec(string)) !== null) {
      const { 0: token, index } = m;
  
      if (
        // Ignore already capitalized words.
        !IS_MANUAL_CASE.test(token) &&
        // Ignore small words except at beginning or end.
        (!SMALL_WORDS.test(token) ||
          index === 0 ||
          index + token.length === string.length) &&
        // Ignore URLs.
        (string.charAt(index + token.length) !== ":" ||
          WHITESPACE.test(string.charAt(index + token.length + 1)))
      ) {
        // Find and uppercase first word character, skips over *modifiers*.
        result += token.replace(ALPHANUMERIC_PATTERN, (m) => m.toUpperCase());
        continue;
      }
  
      result += token;
    }
  
    return result;
};

const types = [
    { fn: (string: string) => string.toLowerCase(), name: 'lower case', key: 'lower' },
    { fn: (string: string) => string.toUpperCase(), name: 'UPPER CASE', key: 'upper' },
    { fn: (string: string) => string.charAt(0).toUpperCase() + string.slice(1), name: 'Sentence case', key: 'sentence' },
	{ fn: (string: string) => titleCase(string), name: 'Title Case', key: 'title' },
    { fn: (string: string) => {
        return string.split(' ').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join('')
    }, name: 'CamelCase', key: 'camel' },
    { fn: (string: string) => string.split(' ').join('_').split('-').join('_'), name: 'snake_case', key: 'snake' },
	{ fn: (string: string) => string.split(' ').join('-').split('_').join('-'), name: 'kebab-case', key: 'kebab' },
	{ fn: (string: string) => string.toLowerCase().replace(/[^\w\s]/gi, '').split(' ').join('-'), name: 'url-slug', key: 'slug' },
    { fn: (string: string) => string.split('').join(' '), name: 'Spaced', key: 'spaced' },
	{ fn: (string: string) => {
			let output = ''
		    string.split('').forEach((l, i) => {
		        output += i % 2 === 0 ? l.toLowerCase() : l.toUpperCase()
		    })
		    return output
    }, name: 'sPoNgEbOb cAsE', key: 'spongebob'},
	{ fn: (string: string) => {
        let output = ''
        string.split('').forEach(l => {
            output = `${l}${output}`
        })
        return output
    }, name: 'esrever', key: 'reverse' },
]

export default function Command(props: LaunchProps) {
  const text = props.arguments.text

  const rows = types.map((type): ReactNode => {
    const output: string = type.fn(text)
    return (
        <List.Item
          key={type.key}
          title={type.name}
          accessories={[{ text: output }]}
          actions={<Actions contents={output} title={type.name} />}
          icon={`${type.key}.png`}
        />
    )
  })

  return (
    <List>
        {rows}
    </List>
  );
}