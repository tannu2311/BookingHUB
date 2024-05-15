
import  { useEffect, useState, useRef } from 'react';

const editorConfiguration = {
    toolbar: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'outdent',
        'indent',
        '|',
        'blockQuote',
        'undo',
        'redo'
    ]
};

function CustomEditor( props ) {
    const editorRef = useRef()
   
    const [editorLoaded, setEditorLoaded] = useState(false)
    const { CKEditor, ClassicEditor } = editorRef.current || {}

    useEffect(() => {
        editorRef.current = {
            CKEditor: require('@ckeditor/ckeditor5-react').CKEditor, 
            ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),      
        }

        setTimeout(() => {
            setEditorLoaded(true);
        }, 500);

        return () => {}
    }, []);

        return (<> 
            {editorLoaded ? (
                <CKEditor
                editor={ClassicEditor}
                config={ editorConfiguration }
                data={ props.initialData }
                onReady={ editor => {
                   
                } }
                onChange={ (event, editor ) => {
                    const data = editor.getData();
                    
                    props.onChange(data);
                } }
            />
            )
            : 
            <div>Editor loading</div> }
            </>
       
        )
}

export default CustomEditor;
