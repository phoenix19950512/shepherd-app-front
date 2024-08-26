import { ZipTransformer } from '@blocksuite/blocks';
import { AffineEditorContainer } from '@blocksuite/presets';
import { Doc, DocCollection } from '@blocksuite/store';
import { useParams } from 'react-router';

import { configuration } from './globalDoc';

import '@blocksuite/presets/themes/affine.css';
import ApiService from '../../../../../services/ApiService';

export interface EditorContextType {
  editor: AffineEditorContainer | null;
  collection: DocCollection | null;
  updateCollection: (newCollection: DocCollection) => void;
}

export const initEditor = () => {
  const params = useParams();

  const { collection } = configuration;
  const editor = new AffineEditorContainer();

  if (params.id) {
    ApiService.getNote(params.id)
      .then((response) => {
        response.json().then((json) => {
          const note = json.data.data.note;
          const [metadata, data] = note.split(',');
          const mime = metadata.match(/:(.*?);/)[1];
          const binary = atob(data);
          const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
          const blob = new Blob([bytes], { type: mime });
          ZipTransformer.importDocs(collection, blob)
            .then(([newDoc, _]) => {
              editor.doc = newDoc;
              configuration.doc = editor.doc;
            });
        });
      });
  } else {
    configuration.doc.load(() => {
      const pageBlockId = configuration.doc.addBlock('affine:page', {});
      configuration.doc.addBlock('affine:surface', {}, pageBlockId);
      const noteId = configuration.doc.addBlock('affine:note', {}, pageBlockId);
      configuration.doc.addBlock('affine:paragraph', {}, noteId);
    });
    editor.doc = configuration.doc;
  }

  editor.slots.docLinkClicked.on(({ docId }) => {
    const target = <Doc>collection.getDoc(docId);
    editor.doc = target;
  });

  return { editor, collection };
}
