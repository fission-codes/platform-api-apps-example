const hide = (...ids) => {
  ids.forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
};

const show = (...ids) => {
  ids.forEach(id => {
    const el = document.getElementById(id);
    el.style.display = 'block';
  });
};

const loadApp = (domain, publishedSiteUrl, publishedSiteFrame, publishedContainer) => {
  const fullDomain = 'https://' + domain;

  // Update displayed URL
  publishedSiteUrl.href = fullDomain;
  publishedSiteUrl.textContent = fullDomain;

  // Reload the iframe with the site preview
  publishedSiteFrame.remove();

  const newNode = document.createElement('iframe');
  newNode.id = 'publishedSite';
  newNode.src = fullDomain;
  newNode.style.width = '100%';
  newNode.style.height = '200px';
  newNode.style.marginBottom = '1rem';
  newNode.style.border = '1px solid var(--color-bg-secondary)';
  newNode.style.borderRadius = 'var(--border-radius)';
  publishedContainer.prepend(newNode);

  return newNode;
}

export { hide, show, loadApp };