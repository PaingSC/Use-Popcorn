import { useEffect } from "react";

export function useKey(keyName, callbackFn) {
  useEffect(
    function () {
      function comCallback(e) {
        if (e.code.toLowerCase() === keyName.toLowerCase()) {
          callbackFn();
        }
      }

      document.addEventListener("keydown", comCallback);
      return function () {
        document.removeEventListener("keydown", comCallback);
      };
    },
    [callbackFn, keyName]
  );
}
