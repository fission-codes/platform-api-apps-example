import * as dom from './dom.js';

// Set up references to DOM nodes
const scenarioSpan = document.getElementById('scenario');
const signInButton = document.getElementById('sign-in');

const createAppButton = document.getElementById('create-app-button');
const deleteAppButton = document.getElementById('delete-app-button');

const editorInput = document.getElementById('editor-input');
const publishAppButton = document.getElementById('publish-app');

let publishedSiteFrame = document.getElementById('published-site-frame');
const publishedSiteUrl = document.getElementById('published-url');
const publishedContainer = document.getElementById('published-container');
const reloadPublishedButton = document.getElementById('reload-published-button');


const fissionInit = {
  permissions: {

    // We store the domain name of the published app
    // in app storage.
    app: {
      name: 'platform-api-demo',
      creator: 'bgins'
    },

    // The HTML for the app is published to the
    // public filesystem.
    fs: {
      public: [{ directory: ["Apps"] }],
    },

    // We request permission to use the platform APIs
    // for all apps. This can be restricted to specific
    // apps when the domain names are known ahead of time.
    platform: {
      apps: "*",
    }
  }
};


webnative.initialize(fissionInit).then(async state => {
  switch (state.scenario) {
    case webnative.Scenario.AuthSucceeded:
    case webnative.Scenario.Continuation:
      scenarioSpan.textContent = 'Signed in.';

      const fs = state.fs;

      // Retrieve a listing of the signed in user's apps
      const apps = await webnative.apps.index();

      // Set up a path to store the domain name for the app published by this demo.
      // This domain name is stored in the demo app's app storage.
      const storedDomainPath = fs.appPath(webnative.path.file('domain.txt'));

      const configureAppDemo = async domain => {
        const name = domain.split('.')[0];

        // The path for published app and its index.html
        const appPath = webnative.path.directory('public', 'Apps', `${name}`)
        const appIndexPath = webnative.path.file('public', 'Apps', `${name}`, 'Published', 'index.html')

        publishAppButton.addEventListener('click', async (event) => {
          event.preventDefault();

          // Retrieve content from editor and publish it to WNFS
          const content = editorInput.value;
          await fs.write(appIndexPath, content);
          await fs.publish();

          // Retrieve the CID for the published app directory
          const ipfsPath = webnative.path.directory('Apps', `${name}`, 'Published')
          const posixPath = webnative.path.toPosix(ipfsPath);
          const ipfs = await webnative.ipfs.get();
          const rootCid = await fs.root.put();
          const stats = await ipfs.files.stat(`/ipfs/${rootCid}/p/${posixPath}`);
          const cid = stats.cid.toBaseEncodedString();

          // Publish a new version of the app
          await webnative.apps.publish(domain, cid);
        });

        reloadPublishedButton.addEventListener('click', event => {
          event.preventDefault();
          publishedSiteFrame = dom.loadApp(domain, publishedSiteUrl, publishedSiteFrame, publishedContainer);
        });

        deleteAppButton.addEventListener('click', async (event) => {
          event.preventDefault();

          // Delete the app registration
          webnative.apps.deleteByDomain(domain);

          // Remove the app from WNFS
          if (await fs.exists(appPath)) {
            await fs.rm(appPath);
          }

          // Remove the stored domain name
          await fs.rm(storedDomainPath);
          await fs.publish();

          dom.hide('editor', 'published-site', 'delete-app');
          dom.show('create-app');
        });

      }

      if (await fs.exists(storedDomainPath)) {
        const domain = await fs.read(storedDomainPath);

        if (apps.map(app => app.domain).includes(domain)) {
          // A stored domain and matching registered domain were found
          await configureAppDemo(domain);

          // Load the app into an iframe.
          publishedSiteFrame = dom.loadApp(domain, publishedSiteUrl, publishedSiteFrame, publishedContainer)

          dom.show('editor', 'published-site', 'delete-app', 'learn-more');
        } else {
          // A stored domain name was found, but it did not match a registered app
          dom.show('create-app');
        }
      } else {
        // A stored domain name was not found, let's create one!
        dom.show('create-app');
      }


      createAppButton.addEventListener('click', async (event) => {
        event.preventDefault();

        // Create an app
        const { domain } = await webnative.apps.create();

        // Store the domain name
        await fs.write(storedDomainPath, domain);
        await fs.publish();

        await configureAppDemo(domain);

        // Load the app. This will show a placeholder site until we publish our content.
        publishedSiteFrame = dom.loadApp(domain, publishedSiteUrl, publishedSiteFrame, publishedContainer)

        dom.show('editor', 'published-site', 'delete-app', 'learn-more');
        dom.hide('create-app');
      });

      break;

    case webnative.Scenario.NotAuthorised:
    case webnative.Scenario.AuthCancelled:
      scenarioSpan.textContent = 'Not signed in.';
      dom.show('sign-in');
      break;
  }

  signInButton.addEventListener('click', () => {
    console.log('signing in');
    webnative.redirectToLobby(state.permissions);
  });

}).catch(error => {
  switch (error) {
    case 'UNSUPPORTED_BROWSER':
      scenarioSpan.textContent = 'Unsupported browser.';
      break;

    case 'INSECURE_CONTEXT':
      scenarioSpan.textContent = 'Insecure context.';
      break;
  }
})