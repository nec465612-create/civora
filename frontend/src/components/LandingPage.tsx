import React from 'react';

export const LandingPage: React.FC<{ onOpenWorkbench: () => void }> = ({ onOpenWorkbench }) => (
  <main className="landing-page">
    <div className="genlayer-mark" aria-hidden="true"><span /><span /><span /><span /><span /></div>
    <header className="landing-header">
      <a className="landing-wordmark" href="#top" aria-label="Civora home">Civora</a>
      <nav aria-label="Public information">
        <a href="#overview">Overview</a><a href="#how">How it works</a><a href="#docs">Documentation</a><a href="#network">Network</a>
      </nav>
      <button className="landing-cta" type="button" onClick={onOpenWorkbench}>Open Workbench ↗</button>
    </header>
    <section className="landing-hero" id="overview">
      <p className="eyebrow">PUBLIC DATA · SHARED VERIFICATION · BETTER POLICY</p>
      <h1>Official data.<br />Verified before action.</h1>
      <p className="hero-copy">Consensus-backed revision checks for public statistical policy simulations.</p>
    </section>
    <section className="product-preview" id="how" aria-label="Civora verification model preview">
      <div className="preview-top"><strong>Civora</strong><span>Powered by GenLayer · Studio Next</span></div>
      <div className="preview-body">
        <div><small>LATEST RELEASE</small><h2>Consumer Price Index</h2><p>Bureau of Labor Statistics · Monthly release</p></div>
        <ol className="verification-steps"><li>Source release</li><li>Consensus check</li><li>Revision state</li></ol>
        <div className="state-cards"><span className="state-ok">UNCHANGED</span><span className="state-revised">REVISED</span><span className="state-hold">HOLD</span></div>
      </div>
    </section>
    <section className="landing-cards" id="docs">
      <article><h2>Why it matters</h2><p>Policy simulations should not silently rely on superseded official releases.</p></article>
      <article><h2>Verification model</h2><p>Independent GenLayer validators compare bounded official evidence before state changes.</p></article>
      <article id="network"><h2>Read the docs</h2><p>Review the evidence boundary, contract lifecycle, network and safe recovery flow.</p></article>
    </section>
  </main>
);
