// Arquivo removido: fluxo de IA não é mais utilizado.
{{{bettingData}}}
'''`,
  });

  const { output } = await prompt(input);
  if (!output) {
    throw new Error('Could not normalize betting data.');
  }
  return output;
}
