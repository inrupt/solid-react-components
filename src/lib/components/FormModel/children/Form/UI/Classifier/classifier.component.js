import React, { useState, useEffect } from 'react';
import unique from 'unique';
import { fetchLdflexDocument } from '@utils';

type Props = {
  id: string,
  retrieveNewFormObject: Function
};

const Classifier = ({ id, retrieveNewFormObject, ...rest }: Props) => {
  const [options, setOptions] = useState([]);
  const from = rest['ui:from'] || null;
  const canMintNew = rest['ui:canMintNew'] || false;

  const init = async () => {
    /*
    const document = from ? await fetchLdflexDocument(from) : null;
    console.log('Document', document);
    if (document) {
      for await (const subject of document.subjects) {
        const subclass = subject.value;
        let subClassURL;
        try {
          subClassURL = new URL(subclass);
        } catch (e) {
          subClassURL = null;
        }
        if (subClassURL) {
          console.log('Subclass', subClassURL);
        }
      }
    }
    */
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <select>
        {options.map(option => (
          <option key={unique()} />
        ))}
      </select>
    </div>
  );
};

export default Classifier;
