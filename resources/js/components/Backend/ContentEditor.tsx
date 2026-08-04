import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';
import { useTheme } from '../shared/theme-provider';

export default function ContentEditor({ initialValue, ...rest }) {
  const editorRef = useRef(null);
  const { theme } = useTheme();
  const editorConfig = {
    license_key: 'gpl',
    initial_value: initialValue,
    plugins:
      'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion',
    // editimage_cors_hosts: ["picsum.photos"],
    menubar: 'file edit view insert format tools table help',
    toolbar:
      'blocks | forecolor backcolor removeformat | bold italic underline strikethrough | link image blockquote codesample | align bullist numlist | code | undo redo | accordion accordionremove | fontfamily fontsize | table media | lineheight outdent indent| charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample',
    autosave_ask_before_unload: true,
    autosave_interval: '30s',
    autosave_prefix: '{path}{query}-{id}-',
    autosave_restore_when_empty: false,
    autosave_retention: '2m',
    image_advtab: true,
    importcss_append: true,
    image_title: true,
    image_caption: true,
    automatic_uploads: true,
    image_class_list: [{ title: 'img-responsive', value: 'img-responsive' }],
    images_upload_url: '/admin/post/uploadmedia',
    images_upload_base_path: '/',
    images_reuse_filename: true,
    image_file_types: 'jpeg,webp,png',
    file_picker_types: 'image',
    min_height: 600,
    max_height: 750,
    width: '100%',
    quickbars_selection_toolbar:
      'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
    noneditable_class: 'mceNonEditable',
    toolbar_mode: 'sliding',
    contextmenu: 'link image table',
    skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
    content_css: theme === 'dark' ? 'dark' : 'default',
    content_style:
      "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; font-size:16px }",
  };

  return (
    <Editor
      ref={editorRef}
      licenseKey="gpl"
      initialValue={initialValue}
      onInit={(evt, editor) => {
        editorRef.current = editor;
      }}
      init={editorConfig}
      tinymceScriptSrc="/assets/tinymce/tinymce.min.js"
      scriptLoading={{ async: true, defer: true }}
      {...rest}
    />
  );
}
