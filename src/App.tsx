/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import "./App.css";

import { useForm, Controller } from "react-hook-form";
import { Modal } from "antd";
import { TextAreaComponent } from "./components/TextArea";

function App() {
  const { register, control, watch } = useForm({
    defaultValues: useMemo(
      () => ({
        numProcesso: "S20230811",
        numPlaca: "3",
        texto:
          "<p>teste <b>template</b>, ${numProcesso} com ${numPlaca} em sua via.</p>"
      }),
      []
    )
  });

  const object2Replace = watch();

  const listInputs = [
    {
      name: "numProcesso"
    },
    {
      name: "numPlaca"
    }
  ];
  const [open, setOpen] = useState(false);
  const openReport = (call: any) => () => call(true);
  const closeReport = (call: any) => () => call(false);

  return (
    <>
      <div className="card">
        <button onClick={openReport(setOpen)}> Abrir Relariorio </button>

        <Modal
          open={open}
          onOk={closeReport(setOpen)}
          onCancel={closeReport(setOpen)}
        >
          {listInputs.map(({ name }: any) => (
            <input type="text" {...register(name)} />
          ))}

          <div className="card">
            <Controller
              name="texto"
              control={control}
              render={({ field }) => (
                <TextAreaComponent replacer={object2Replace} {...field} />
              )}
            />
          </div>
        </Modal>
        <pre>{object2Replace.texto}</pre>
      </div>
    </>
  );
}

export default App;
