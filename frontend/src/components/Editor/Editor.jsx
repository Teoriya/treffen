import React, { useEffect, useRef } from "react";
import styles from "./Editor.module.css";
import { basicSetup, EditorView } from "codemirror"
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorState } from "@codemirror/state"
import { cpp } from "@codemirror/lang-cpp"
import { drawSelection } from "@codemirror/view"
import { peerExtension } from "./customExtension";
import { ACTIONS } from "../../socket/actionsEditor";


const fixedHeightEditor = EditorView.theme({
  "&": { height: "calc(100vh - 255px)" },
  ".cm-scroller": { overflow: "auto" }
})


const Editor = ({ socket, roomId }) => {
  const elementRef = useRef();
  const editorRef = useRef(null);

  useEffect(() => {
    socket.emit(ACTIONS.FETCH,{roomId});
    socket.once(ACTIONS.PULL,({version,code})=>{
      const state = EditorState.create({
        doc: code,
        extensions: [peerExtension(version,socket,roomId),EditorView.lineWrapping, basicSetup, oneDark, cpp(), fixedHeightEditor, drawSelection({ cursorBlinkRate: 0 })],
      });
      editorRef.current = new EditorView({
        state,
        lineWrapping: true,
        parent: elementRef.current
      })
      
    })
    return () => editorRef.current?.destroy();
  }, [elementRef,roomId,socket])
  return (
    <div ref={elementRef} className={styles.editorWrap}></div>
  )
}


export default Editor;