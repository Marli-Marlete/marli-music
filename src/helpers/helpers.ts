export function shuffleArray<T>(array: Array<T>): T[] {
  let currentIndex = array.length;
  let randomIndex: number;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export function fragmentContent(
  itemsToShow: string,
  limit = 1000,
  delimiter = ''
): string[] {
  const contentLengh = itemsToShow.length;
  const parts = Math.ceil(contentLengh / limit);

  let count = 1;
  let initRange = 0;
  const result: string[] = [];
  while (count <= parts) {
    let finalRange = initRange + limit;
    if (delimiter && finalRange[finalRange - 1] !== delimiter) {
      const lastIndexOfDelimiter = itemsToShow.lastIndexOf(
        delimiter,
        finalRange
      );
      finalRange = lastIndexOfDelimiter + delimiter.length;
    }
    const fragment = itemsToShow.slice(initRange, finalRange);
    result.push(fragment);
    initRange = finalRange;
    count++;
  }

  return result;
}
