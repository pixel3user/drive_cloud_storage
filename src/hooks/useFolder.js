import { getDoc, doc, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { useReducer } from "react";
import { useAuth } from "../contexts/authContext";
import { database } from "../firebase";

const ACTIONS = {
    SELECT_FOLDER: 'select-folder',
    UPDATE_FOLDER: 'update-folder',
    SET_CHILD_FOLDERS: 'set-child-folders',
    SET_CHILD_FILES: 'set-child-files'
}

export const ROOT_FOLDER = { name: "Root", id: null, path: []}

function reducer(state, {type, payload}){
    switch(type){
        case ACTIONS.SELECT_FOLDER:
            return{
                folderId: payload.folderId,
                folder: payload.folder,
                childFiles: [],
                childFolders: []
            }
        case ACTIONS.UPDATE_FOLDER:
            return {
                ...state,
                folder: payload.folder
            }
        case ACTIONS.SET_CHILD_FOLDERS:
            return{
                ...state,
                childFolders: payload.childFolders
            }
        case ACTIONS.SET_CHILD_FILES:
            return{
                ...state,
                childFiles: payload.childFiles
            }
        default: 
            return state
    }
}

export function useFolder(folderId = null, folder = null){
    const [state, dispatch] = useReducer(reducer, {
        folderId,
        folder,
        childFolders: [],
        childFiles: []
    })

    const {currentuser} = useAuth()

    useEffect(() => {
        dispatch({type: ACTIONS.SELECT_FOLDER, payload: { folderId, folder}})
    },[folderId,folder])

    useEffect(() => {
        if(folderId == null){
            return dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: {folder: ROOT_FOLDER}
            })
        }

        getDoc(doc(database.folders,folderId)).then( doc => {
            dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: {folder: database.formatDoc(doc)}
            })
            // console.log(database.formatDoc(doc))
        }).catch((e) => {
            console.error(e)
            dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: {folder: ROOT_FOLDER}
            })
        })

    },[folderId])

    useEffect(() => {
            const q = query((database.folders), where("parentId","==",folderId), orderBy("createdAt"), where("userId","==",currentuser.uid))
            return onSnapshot(q,snapshot => {
                dispatch({
                    type: ACTIONS.SET_CHILD_FOLDERS,
                    payload: {childFolders: snapshot.docs.map(database.formatDoc)}
                })
            })
    },[folderId,currentuser])

    useEffect(() => {
        const q = query((database.files), where("folderId","==",folderId), orderBy("createdAt"), where("userId","==",currentuser.uid))
        return onSnapshot(q,snapshot => {
            dispatch({
                type: ACTIONS.SET_CHILD_FILES,
                payload: {childFILES: snapshot.docs.map(database.formatDoc)}
            })
        })
    },[folderId,currentuser])

    return state

}