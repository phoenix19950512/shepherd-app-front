import React, { useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Job } from '@blocksuite/store';
import { DownloadIcon, ZipTransformer } from '@blocksuite/blocks';
import { SaveIcon } from 'lucide-react';

import BlockSuite from "../blockSuite";
import { configuration } from "../blockSuite/editor/globalDoc";
import ApiService from '../../../../services/ApiService';
import { StyledToolbar } from './styles';

const NewNote = () => {
  const colors = {
    success: 'rgb(32, 173, 87)',
    info: 'rgb(59, 67, 255)',
    danger: 'rgb(239, 50, 50)',
  }
  const [state, setState] = useState('');
  const [color, setColor] = useState(colors.info);
  const params = useParams();
  const pdfRef = useRef();
  const { collection } = configuration;

  const handleSaveClick = async () => {
    if (state == 'Saving note...' || state == 'Downloading...') return;
    try {
      setColor(colors.info);
      setState('Saving note...');
      const job = new Job({ collection });
      const json = await job.docToSnapshot(configuration.doc);
      const zip = await ZipTransformer.exportDocs(collection, [configuration.doc]);
      let summary = document.querySelector('affine-note').innerText;
      if (summary.length > 252) summary = `${summary.slice(0, 50)}...`;
      const docMetaTags = document.querySelector('doc-meta-tags').shadowRoot.querySelectorAll('.tag-inline');
      const tags = [];
      for (let i = 0; i < docMetaTags.length; i++) {
        tags.push(docMetaTags[i].textContent);
      }

      const arrayBuffer = await zip.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const binary = String.fromCharCode(...bytes);
      const note = `data:${zip.type};base64,${btoa(binary)}`;
      const data = {
        topic: json.meta.title,
        tags: tags,
        note: note,
        summary: summary,
      }
      if (params.id) {
        await ApiService.updateNote(params.id, data);
        setState('Saved successfully!');
        setColor(colors.success);
      } else {
        await ApiService.createNote(data);
        setState('Saved successfully!');
        setColor(colors.success);
      }
    } catch (e) {
      setState(`Something went wrong while saving. Error: ${e}`);
      setColor(colors.danger);
    }
  }
  const handleDownloadClick = async () => {
    if (state == 'Saving note...' || state == 'Downloading...') return;
    try {
      setColor(colors.info);
      setState('Downloading...');
      const job = new Job({ collection });
      const json = await job.docToSnapshot(configuration.doc);
      const title = json.meta.title;
      if (title == '') {
        setColor(colors.danger);
        setState('Please set your title.');
        return;
      }
      /*
        Logic for saving component as PDF
      */
      // const input = pdfRef.current;
      // const canvas = await html2canvas(input, { scale: 2 })
      // const imgData = canvas.toDataURL('image/png');
      // const pdf = new jsPDF('p', 'pt', 'a4');
      // const pdfWidth = pdf.internal.pageSize.getWidth();
      // const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      // pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      // pdf.save(`${title}.pdf`);
      setState('Downloaded successfully!');
      setColor(colors.success);
    } catch (e) {
      setState(`Something went wrong while downloading. Error: ${e}`);
      setColor(colors.danger);
    }
  }

  return (
    <div>
      <StyledToolbar>
        <button className='saveBtn' onClick={handleSaveClick}>
          <SaveIcon className='icon' size={18} /> Save
        </button>
        {/* <button className='downloadBtn' onClick={handleDownloadClick}>
          <span dangerouslySetInnerHTML={{ __html: DownloadIcon.strings[0] }} />
          Save as PDF
        </button> */}
        <span className='status' style={{ color: color }}>{state}</span>
      </StyledToolbar>
      <BlockSuite ref={pdfRef} />
    </div>
  );
}

export default NewNote