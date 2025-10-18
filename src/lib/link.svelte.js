import { browser } from '$app/environment';
function getFavicon(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch (error) {
    return `https://www.google.com/s2/favicons?domain=${url}&sz=32`;
  }
}

const defaultLinks = [
  { name: "Github", url: "https://www.github.com", id: crypto.randomUUID(), icon: getFavicon('https://github.com') },
];

const stored = browser ? localStorage.getItem("quickLinks") : null;
export const quickLinks = $state(stored ? JSON.parse(stored) : defaultLinks);

function save() {
  if (browser) {
    console.log("Saving links to localStorage...");
    localStorage.setItem("quickLinks", JSON.stringify(quickLinks));
  }
};

export function addLink(name, url) {
  const newLink = {
    name: name,
    url: url.startsWith("http") ? url : `https://${url}`,
      id: crypto.randomUUID(),
      icon: getFavicon(url),
  };
  quickLinks.push(newLink);
  save()
}

export function removeLink(id) {
  const index = quickLinks.findIndex(link => link.id === id);
  if (index > -1) {
    quickLinks.splice(index, 1);
    save();
  }
}
