import { APIEmbed } from 'discord.js';

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

export function createEmbedMessage(embed: APIEmbed): APIEmbed {
  const replyEmbed = {
    url: embed?.url,
    title: embed.title,
    description: embed?.description,
    color: embed.color ?? 0x00ffff,
    image: {
      url: embed?.image?.url,
      width: 0,
      height: 0,
    },
    thumbnail: {
      url: embed?.thumbnail?.url,
      width: 0,
      height: 0,
    },
    author: {
      name: embed?.author.name,
      url: embed?.author?.url,
      icon_url: embed?.author?.icon_url,
    },
    footer: {
      text: `adicionado por ${embed.footer.text}`,
    },
  };

  return replyEmbed;
}

export function sanitizeUrl(url: string) {
  const regex = /intl-[a-zA-Z]{2}\//;

  const modifiedUrl = url.trim().replace(regex, '');

  return modifiedUrl;
}
