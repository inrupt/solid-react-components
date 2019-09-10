import React, { useState, useEffect } from 'react';
import unique from 'unique';
// import { fetchLdflexDocument } from '@utils';

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
    if (document) {
      let docOptions = [];
      for await (const subject of document.subjects) {
        docOptions = [...docOptions, subject.value.split('#').pop()];
      }
      setOptions(docOptions);
      // setOptions(options.map(subject => subject.split('#').pop()));
    }
    */
    setOptions([]);
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
