import React from 'react';
import './GlossaryModal.css';

const glossaryTerms = [
  { term: "Address", definition: "A string of characters that represents a wallet on the blockchain. It's like an email address for crypto; you can share it to receive funds." },
  { term: "Gas Fees", definition: "The cost required to perform a transaction or execute a smart contract on the blockchain. It's paid to validators for securing the network." },
  { term: "Smart Contract", definition: "A self-executing program stored on a blockchain that runs when predetermined conditions are met. All quests on this platform are powered by smart contracts." },
  { term: "dApp", definition: "A Decentralized Application. An app built on a decentralized network, like DeFiQuest, that combines a frontend user interface with backend smart contracts." },
  { term: "Liquidity Pool", definition: "A collection of tokens locked in a smart contract. These pools are used to facilitate decentralized trading, lending, and other functions." },
];

const GlossaryModal = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>DeFi Glossary</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        <div className="modal-body">
          {glossaryTerms.map(item => (
            <div className="glossary-item" key={item.term}>
              <h4>{item.term}</h4>
              <p>{item.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlossaryModal;