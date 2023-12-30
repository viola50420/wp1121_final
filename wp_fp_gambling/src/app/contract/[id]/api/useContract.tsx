"use client";
import React, { useState, useEffect, createContext } from 'react';
import { outcomeEnum, typeEnum } from '@/db/schema';

export type ContractTable = {
  id: string;
  type: string;
  title: string;
  description: string;
  optionA: string;
  optionB: string;
  optionC: string;
  totalDollar: number;
  optionADollar: number;
  optionBDollar: number;
  optionCDollar: number;
  attendees: number;
  blockDate: string;
  updateDate: string;
  outcome: typeof outcomeEnum;
};

export type BetTable = {
  id: string;
  contractId: string;
  userId: string;
  option: string;
  dollar: number;
};

export type ContractContext = {
  contractId: string | null;
  setContractId: (contractId: string | null) => void;
  contractType: string | null;
  setContractType: (contractType: string | null) => void;
  contracts: ContractTable[] | null;
  setContracts: (contracts: ContractTable[] | null) => void;
  contract: ContractTable | null;
  setContract: (contract: ContractTable | null) => void;
  bets: BetTable | null;
  setBets: (bets: BetTable | null) => void;
  dollar: number | null;
  setDollar: (dollar: number | null) => void;
  userId: string | null;
  setUserId: (userId: string | null) => void;
};

export const ContractContext = createContext<ContractContext>({
  contractId: null,
  setContractId: () => {},
  contractType: null,
  setContractType: () => {},
  contracts: null,
  setContracts: () => {},
  bets: null,
  setBets: () => {},
  contract: null,
  setContract: () => {},
  dollar: null,
  setDollar: () => {},
  userId: null,
  setUserId: () => {},
});

type ContractProviderProps = {
  children: React.ReactNode;
};

export function ContractProvider({ children }: ContractProviderProps) {
  const [contractId, setContractId] = useState<string | null>(null); // Update the type here
  const [contractType, setContractType] = useState<string | null>(null); // Update the type here
  const [contracts, setContracts] = useState<ContractTable[] | null>(null);
  const [contract, setContract] = useState<ContractTable | null>(null);
  const [bets, setBets] = useState<BetTable | null>(null);
  const [dollar, setDollar] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!contractId) {
      return;
    }
    fetchContract(contractId);
    console.log('Contract ID:', contractId);
    fetchBets(userId!, contractId!);
  }, [contractId]);
  
  useEffect(() => {
    if (!contractType) {
      return;
    }
    fetchContractsByType(contractType);
    console.log('Contract Type:', contractType);
  }, [contractType]);

  useEffect (() => {
    if (!userId) {
      return;
    }
    fetchDollar(userId);
    console.log('User ID:', userId);
    fetchBets(userId!, contractId!);
  }, [userId]);

  const fetchContract = async (id: string): Promise<void | null> => { // Update the return type here
    if (!id) {
      return null;
    }
    console.log('Fetching contract:', id);
    try {
      const res = await fetch(`/api/contract/?contractId=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          },
          });
      const data = await res.json();
      console.log('Contract:', data.data[0]);
      setContract(data.data[0]);
    } catch (error) {
      console.error('Error fetching contract:', error);
    }
  };
  
  const fetchContractsByType = async (type: string) => {
    if (!type) {
      return;
    }
    try {
      console.log('Fetching contracts:', type);
      const res = await fetch(`/api/contract/?type=${type}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          },
          });
      const data = await res.json();
      console.log('Contracts:', data.data);
      setContracts(data.data);
      return data.data;
    } catch (error) {
      console.error('Error fetching contracts:', error);
      return;
    }
  }

  const fetchDollar = async (userId: string) => {
    if (!userId) {
      return;
    }
    try {
      console.log('Fetching dollar:', userId);
      const res = await fetch(`/api/user/?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          },
          });
      const data = await res.json();
      console.log('Dollar:', data.data[0].dollar);
      setDollar(data.data[0].dollar);
      return data.data[0].dollar;
    } catch (error) {
      console.error('Error fetching dollar:', error);
      return;
    }
  }

  const fetchBets = async (userId: string, contractId: string) => {
    if (!userId) {
      return;
    }
    try {
      console.log('Fetching bet:', userId);
      const res = await fetch(`/api/bet/?userId=${userId}&forWhat=user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          },
          });
      const data = await res.json();
      const betData = data.data.filter((bet: any) => bet.contractId === contractId)[0];
      console.log('Bet:', betData);
      setBets(betData);
      return betData;
    } catch (error) {
      console.error('Error fetching bet:', error);
      return;
    }
  }
  
  return (
    <ContractContext.Provider value={{ dollar, setDollar, userId, setUserId, contractId, setContractId, contracts, setContracts, contract, setContract, contractType, setContractType, bets, setBets }}>
      {children}
    </ContractContext.Provider>
  );
}