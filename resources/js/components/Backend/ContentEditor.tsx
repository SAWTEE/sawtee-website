import { Editor } from '@tinymce/tinymce-react';
import { useRef, useState } from 'react';
import { useTheme } from '../shared/theme-provider';

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";

export default function ContentEditor({
  initialValue = undefined,
  onChange,
  onEditorChange,
  ...rest
}: any) {
  const editorRef = useRef<any>(null);
  const { resolvedTheme, theme } = useTheme();
  const isDark =
    resolvedTheme === 'dark' || (resolvedTheme == null && theme === 'dark');
  const skinKey = isDark ? 'dark' : 'light';

  // Preserve edits across theme-driven remounts (skin/content_css are init-only).
  const [content, setContent] = useState(() => initialValue ?? '');

  const editorConfig = {
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
    skin: isDark ? 'oxide-dark' : 'oxide',
    content_css: isDark ? 'dark' : 'default',
    content_style: isDark
      ? `body { font-family: ${FONT_STACK}; font-size:16px; background-color:#1e1e1e; color:#e4e4e7; }`
      : `body { font-family: ${FONT_STACK}; font-size:16px; background-color:#ffffff; color:#18181b; }`,
  };

  return (
    <Editor
      key={skinKey}
      ref={editorRef}
      licenseKey="gpl"
      initialValue={content}
      onInit={(evt: any, editor: any) => {
        editorRef.current = editor;
      }}
      onEditorChange={(newContent: string, editor: any) => {
        setContent(newContent);
        onEditorChange?.(newContent, editor);
      }}
      onChange={(evt: any, editor: any) => {
        setContent(editor.getContent());
        onChange?.(evt, editor);
      }}
      init={editorConfig as any}
      tinymceScriptSrc="/assets/tinymce/tinymce.min.js"
      scriptLoading={{ async: true, defer: true }}
      {...rest}
    />
  );
}
