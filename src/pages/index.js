import React, { useRef, useState } from "react";

import { getConvertedClasses } from "../converterFunctions";

export default function index() {
  const [tailwindCode, setTailwindCode] = useState(null);
  const [htmlCSS, setHtmlCSS] = useState(null);
  const tailwindCSS = useRef();
  const processInput = (input) => {
    return getConvertedClasses(input);
  };

  const createChildObject = (children) => {
    if (children.length > 0) {
      const childObjsArray = [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        childObjsArray.push({
          element: child.nodeName,
          children: createChildObject(child.children),
          style: processInput(child.className),
          text: child?.childNodes[0]?.nodeValue,
        });
      }
      return childObjsArray;
    } else return [];
  };

  const createJsonHtml = (parent) => {
    const htmljson = {
      element: parent.nodeName,
      children: createChildObject(parent.children),
      style: processInput(parent.className),
      text: parent.childNodes[0].nodeValue,
    };

    createCss(htmljson);
  };

  const createCssChildren = (children) => {
    if (children.length > 0) {
      let childHtml = "";
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        childHtml =
          childHtml +
          `<${child.element.toLowerCase()} style=${child.style}>${
            child.text ?? ""
          }${createCssChildren(
            child.children
          )}</${child.element.toLowerCase()}>`;
      }
      return childHtml;
    } else return "";
  };

  const createCss = (htmljson) => {
    let htmlcss = ``;

    htmlcss =
      htmlcss +
      `<${htmljson.element.toLowerCase()} style=${htmljson.style}>${
        htmljson.text ?? ""
      }${createCssChildren(
        htmljson.children
      )}</${htmljson.element.toLowerCase()} >`;

    setHtmlCSS(htmlcss.replace(/(\r\n|\n|\r)/gm, ""));
    return htmlcss;
  };

  const exampleCode = `
  <div class="flex  items-center justify-center bg-blue-100 p-5">
    <div class=" rounded-3xl bg-white p-8 text-center text-gray-800 shadow-xl  ">
      <h3 class="text-2xl text-gray-800">
        Thanks for signing up for Websitename!
      </h3>
      <div class="flex justify-center"></div>

      <p>
        We're happy you're here. Let's get your email address verified:
      </p>
      <div class="mt-4">
        <button class="rounded bg-blue-600 px-2 py-2 text-blue-200">
          Click to Verify Email
        </button>
        <p class="mt-4 text-sm">
          If you’re having trouble clicking the "Verify Email Address"
          button, copy and paste the URL below into your web browser:
          <a href="#" class="text-blue-600 underline">
            http://localhost:8000/email/verify/3/1ab7a09a3
          </a>
        </p>
      </div>
    </div>
  </div>
`;

  const handleTextAreaOnChange = (e) => {
    e.preventDefault();
    setTailwindCode(e?.target?.value);
  };

  return (
    <>
      <div className=" fixed right-0 mt-9 mr-9 w-72 origin-top translate-x-2/4  rotate-45 bg-blue-500 text-center text-white">
        <div>Issues?</div>
        <div>Suggestions?</div>
        <a
          className="underline"
          target="_blank"
          href="https://jjlittle20.github.io/tailwindtocss/"
        >
          Github!
        </a>
      </div>
      <div className="p-8">
        <div className="flex items-center justify-center">
          <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-transparent">
              Tailwind
            </span>{" "}
            to CSS
          </h1>
        </div>
        <div className="flex items-center justify-center">
          <p className="  text-lg font-normal text-gray-500 dark:text-gray-400 lg:text-xl">
            Convert your Tailwind components to CSS!
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        {" "}
        <button
          className=" w-32 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={() => createJsonHtml(tailwindCSS.current)}
        >
          Convert!
        </button>
      </div>
      <div className="grid md:grid-cols-2 h-screen">
        {" "}
        <>
          <div className="mx-8">
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Tailwind Component
            </label>
            <textarea
              id="message"
              rows="4"
              className="mb-8 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Add your component code here..."
              onChange={(e) => handleTextAreaOnChange(e)}
              value={tailwindCode ? tailwindCode : exampleCode}
            ></textarea>
            <div ref={tailwindCSS}>
              <div
                dangerouslySetInnerHTML={{
                  __html: tailwindCode ? tailwindCode : exampleCode,
                }}
              ></div>
            </div>
          </div>
        </>
        <div className="mx-8">
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Your CSS Component
          </label>
          <textarea
            id="message"
            rows="4"
            className="mb-8 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Add your component code here..."
            value={htmlCSS ? htmlCSS : ""}
            readOnly
          ></textarea>
          {htmlCSS ? (
            <div
              dangerouslySetInnerHTML={{
                __html: htmlCSS,
              }}
            ></div>
          ) : null}
        </div>
      </div>
    </>
  );
}
