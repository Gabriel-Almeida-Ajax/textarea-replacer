/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type TextAreaProps = {
  replacer: { [key: string]: any };
  value: string;
  onChange?: (text: string) => void;
};

function replaceByObject(
  template: TextAreaProps["value"] = "",
  replacer: TextAreaProps["replacer"] = {}
): [ReplacersProps, string] {
  let str = String(template);
  const replaced: any = {};

  Object.keys(replacer).forEach((key: keyof typeof replacer) => {
    const field = "${" + key + "}";
    const index = template.indexOf(field);

    if (index !== -1) {
      replaced[key] = { index, value: replacer[key] ?? "", field };
    }
    str = str.replace(field, replacer[key]);
  });

  return [replaced, str];
}

type ReplacedItem = {
  field: string;
  index: number;
  value: string | number;
};

type ReplacersProps = {
  [key: string]: ReplacedItem;
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
      getRange(template, index + String(value).length);
  });

  return template;
}

const replaceBold = (text = "") =>
  String(text).replace(/<b>/g, "<strong>").replace(/<\/b>/g, "</strong>");

export function TextAreaComponent({ replacer, value, onChange }: TextAreaProps) {
  const [text, setText] = useState("");
  const [replaceds, setReplaceds] = useState<ReplacersProps>({});

  value = replaceBold(value);

  useEffect(() => {
    const [replaced, text] = replaceByObject(value, replacer);
    setReplaceds(replaced);
    setText(text);
  }, [replacer, value]);

  const commitChanges = useCallback(
    (_text: string) => {
      const replaced = replaceBold(reverceByReplace(_text, replaceds));
      const lastItem: ReplacedItem = Object.keys(replaceds).reduce(
        (acc: any, crt: any) => {
          if (replaceds[crt].index > acc.index) return replaceds[crt];
          else return acc;
        },
        { index: 0 }
      );
      if (
        !value
          .trim()
          .includes(
            getRange(replaced, 0, lastItem.index + lastItem.field.length + 1).trim()
          )
      ) {
        alert("Não é possível alterar o texto antes dos campos de variáveis.")
        setText(text);
        if (onChange) onChange(replaceBold(reverceByReplace(text, replaceds)));
        return;
      }

      setText(_text);
      if (onChange) onChange(replaceBold(reverceByReplace(_text, replaceds)));
    },
    [onChange, replaceds, text, value]
  );

  const quillRef = useRef();

  return (
    <div>
      <ReactQuill
        ref={quillRef.current}
        value={text}
        onChange={commitChanges}
      />
    </div>
  );
}
