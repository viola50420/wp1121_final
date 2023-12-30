const bet = async (contractId: string, selectedOption: string, betAmount: number, userId: string)  => {
  try {
    console.log('betAmount:', betAmount);
    const postBetResponse = await fetch('/api/bet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        contractId,
        option: selectedOption,
        dollar: betAmount
      }),
    });
    const putContractResponse = await fetch('/api/contract', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: contractId,
        option: selectedOption,
        dollar: betAmount,
      }),
    });
  const deductDollarResponse = await fetch('/api/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      dollar: betAmount * -1,
    }),
  });

    // const data = await response.json();
  } catch (error) {
    console.error('Error saving answer:', error);
  }
};

export default bet;
