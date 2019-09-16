import React, { useState, useEffect } from 'react';
import { n3Helper } from 'solid-forms';
import unique from 'unique';

type Props = {
  id: string,
  retrieveNewFormObject: Function
};

const Classifier = ({ id, retrieveNewFormObject, ...rest }: Props) => {
  const [options, setOptions] = useState([]);
  const from = rest['ui:from'] || null;
  // const canMintNew = rest['ui:canMintNew'] || false;

  const init = async () => {
    const docOptions = await n3Helper.getClassifierOptions(from, 'Type');
    setOptions(docOptions);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <select>
        {options.map(option => (
          <option key={unique()}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default Classifier;
