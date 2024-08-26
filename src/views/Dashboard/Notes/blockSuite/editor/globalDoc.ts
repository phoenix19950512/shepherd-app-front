import { Schema, DocCollection } from '@blocksuite/store';
import { AffineSchemas } from '@blocksuite/blocks';

const schema = new Schema().register(AffineSchemas);
const collection = new DocCollection({ schema });
const doc = collection.createDoc({ id: 'page1' });

export const configuration = { collection, doc };
