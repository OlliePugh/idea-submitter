"use client";

import LoginButton from "@/components/LoginButton";
import { UserContext } from "@/components/UserProvider";
import config from "@/config";
import { getInputErrors } from "@/utils/validate";
import axios from "axios";
import { Form, Formik } from "formik";
import { useContext } from "react";

export default function Home() {
  const { user } = useContext(UserContext);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-end p-2">
        <LoginButton />
      </div>
      <main className="flex flex-1 flex-col items-center justify-center p-24">
        <Formik
          onSubmit={async (values, { setSubmitting }) => {
            const result = await axios.post("/api/submit", values, {
              headers: { Authorization: await user?.getIdToken() },
            });
            setSubmitting(false);
          }}
          validate={(values) => {
            const errors = getInputErrors(values);
            if (errors.length == 0) {
              // fix this jank
              return {};
            }
            return { idea: errors };
          }}
          initialValues={{ idea: "" }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <Form
              onSubmit={handleSubmit}
              className="flex flex-col px-10 py-4 rounded-md drop-shadow-xl gap-3 bg-slate-300"
            >
              <h1 className="text-center font-bold">Submit your Idea!</h1>
              <p>Your idea will be printed out of my label printer!</p>
              <input
                type="text"
                name="idea"
                className="rounded-sm p-2"
                placeholder="My genius idea is..."
                maxLength={100}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.idea}
              />
              <p className={`text-red-500`}>
                {errors.idea && touched.idea && errors.idea}
              </p>
              {config.features.forcedAuth && user == null && (
                <div className="p-4 rounded border-slate-600 border-solid border-2 bg-slate-200 drop-shadow-xl">
                  <p className={`text-red-500 text-center`}>
                    Due to high volume of spam login is required to submit an
                    idea
                  </p>
                </div>
              )}
              <button
                type="submit"
                disabled={
                  isSubmitting &&
                  config.features.forcedAuth &&
                  user == undefined
                }
                className="bg-slate-400 drop-shadow-2xl rounded-sm p-2 text-white font-semibold transition-colors hover:bg-slate-500 disabled:bg-slate-400 disabled:text-slate-500"
              >
                {isSubmitting ? "Printing..." : "Submit"}
              </button>
            </Form>
          )}
        </Formik>
      </main>
      <footer>
        <p className="text-right pr-2">Ollie Q (Oliver Pugh) ©2023</p>
      </footer>
    </div>
  );
}
