import React, { useEffect ,useRef} from "react";
import styles from "./Editor.module.css";
import {basicSetup, EditorView} from "codemirror"
import {oneDark} from '@codemirror/theme-one-dark'
import {EditorState} from "@codemirror/state"
import {cpp} from "@codemirror/lang-cpp"
import {drawSelection} from "@codemirror/view"


const fixedHeightEditor = EditorView.theme({
    "&": {height: "calc(100vh - 255px)"},
    ".cm-scroller": {overflow: "auto"}
  })
  

const Editor = ({ code,setCode }) => {
    const elementRef = useRef();
    const editorRef = useRef(null);
    const userCursor = useRef();

    useEffect(()=>{

        const update  = EditorView.updateListener.of((v) => {
            userCursor.current = v.state.selection
            if(v.state.doc!==code){setCode(v.state.doc)}
          });


        const state = EditorState.create({
            doc: code,
            selection:userCursor.current,
            extensions: [EditorView.lineWrapping,basicSetup,oneDark,cpp(),fixedHeightEditor,update,drawSelection({cursorBlinkRate:0})],
          });

        editorRef.current = new EditorView({
            state,
            lineWrapping: true,
            parent: elementRef.current
          })
          console.log(editorRef)
        return ()=>editorRef.current.destroy();
    },[elementRef,code,setCode])
    return (
        <div ref={elementRef} className={styles.editorWrap}></div>
    )
}


export default Editor;