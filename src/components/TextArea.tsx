/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import ReactQuill from "react-quill";
import debounce from "lodash.debounce";
import "react-quill/dist/quill.snow.css";

type TextAreaProps = {
  replacer: { [key: string]: any };
  template: string;
  handler?: (text: string) => void;
};

function replaceByObject(
  template: TextAreaProps["template"] = "",
  replacer: TextAreaProps["replacer"] = {}
): [any[], string] {
  let str = String(template);
  const replaced: any = {};

  Object.keys(replacer).forEach((key: keyof typeof replacer) => {
    const field = "${" + key + "}";
    const index = template.indexOf(field);

    if (index !== -1) {
      replaced[key] = { index, value: replacer[key], field };
    }
    str = str.replace(field, replacer[key]);
  });

  return [replaced, str];
}

type ReplacersProps = {
  [key: string]: {
    field: string;
    index: number;
    value: string | number;
  };
};

function getRange(text: string, ini: number, fim?: number): string {
  return text.slice(ini, fim);
}

function reverceByReplace(text: string, replacers: ReplacersProps): string {
  let template = String(text);

  Object.keys(replacers).forEach((key) => {
    const { field, index, value } = replacers[key];
    template =
      getRange(template, 0, index) +
      field +
      getRange(template, index + value.toString().length);
  });

  return template;
}

export function TextArea({ replacer, template, handler }: TextAreaProps) {
  const [text, setText] = useState("");
  const [replaceds, setReplaceds] = useState({});

  useEffect(() => {
    const [replaced, text] = replaceByObject(template, replacer);
    setReplaceds(replaced);
    setText(text);
  }, [replacer, template]);

  const commitChanges = useCallback(
    (text: string) => {
      handler && handler(reverceByReplace(text, replaceds));
    },
    [handler, replaceds]
  );

  return (
    <div>
      <ReactQuill
        value={text}
        onChange={debounce(commitChanges, 1500)}
        onBlur={() => commitChanges(text)}
      />
    </div>
  );
}
