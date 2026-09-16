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
      <div className="hero-summary">
        <p className="hero-copy">Consensus-backed revision checks for public statistical policy simulations.</p>
        <p>Civora asks GenLayer validators to independently inspect bounded official evidence before an Intelligent Contract changes the effective state.</p>
      </div>
    </section>
    <section className="product-preview" id="how" aria-label="Civora verification model preview">
      <div className="preview-top"><strong>Civora</strong><span>Powered by GenLayer · Studio Next</span></div>
      <div className="preview-body">
        <div><small>LATEST RELEASE</small><h2>Consumer Price Index</h2><p>Bureau of Labor Statistics · Monthly release</p></div>
        <ol className="verification-steps"><li>Source release</li><li>Consensus check</li><li>Revision state</li></ol>
        <div className="state-cards"><span className="state-ok">UNCHANGED</span><span className="state-revised">REVISED</span><span className="state-hold">HOLD</span></div>
      </div>
    </section>
    <section className="landing-explainer" aria-labelledby="why-title">
      <p className="section-kicker">WHY CIVORA</p>
      <div>
        <h2 id="why-title">Official numbers change.<br />Policy context should show it.</h2>
        <p>BLS releases may be revised after an initial observation. Civora preserves each comparable vintage, distinguishes unchanged evidence from a material revision, and refuses to invent certainty when verification fails.</p>
      </div>
    </section>
    <section className="landing-process" id="docs" aria-labelledby="process-title">
      <div className="section-heading">
        <p className="section-kicker">HOW IT WORKS</p>
        <h2 id="process-title">Evidence becomes state only after consensus.</h2>
      </div>
      <ol>
        <li><span>01</span><h3>Bound the question</h3><p>A policy owner locks an allowlisted CPI series, month, year, comparison and threshold.</p></li>
        <li><span>02</span><h3>Verify the release</h3><p>Validators independently retrieve official BLS evidence and agree on every consequential field.</p></li>
        <li><span>03</span><h3>Preserve the result</h3><p>The contract records the vintage as unchanged, revised, or HOLD with authoritative on-chain state.</p></li>
      </ol>
    </section>
    <section className="landing-facts" id="network" aria-label="Network and evidence boundary">
      <article><p className="section-kicker">NETWORK</p><h2>Studio Next</h2><p>GenLayer development preview · Chain 61997. Every write is finalized and read back from the contract before the interface reports a verified result.</p></article>
      <article><p className="section-kicker">SOURCE BOUNDARY</p><h2>Official BLS only</h2><p>Civora accepts two explicitly allowlisted CPI series. Missing, malformed, unavailable, or non-comparable evidence fails closed to HOLD.</p></article>
      <article><p className="section-kicker">PUBLIC RECORD</p><h2>Auditable vintages</h2><p>Anyone can inspect the trigger specification, evidence fingerprint, lifecycle state, and bounded history without connecting a wallet.</p></article>
    </section>
    <section className="landing-safety" aria-labelledby="safety-title">
      <div><p className="section-kicker">SAFETY</p><h2 id="safety-title">A research instrument—not a benefit or financial decision.</h2></div>
      <p>Civora demonstrates automated official-statistic policy simulation. It creates no legal rights, benefit payments, investment advice, or real-world entitlement. HOLD means the evidence is not safe to treat as conclusive.</p>
      <button className="landing-secondary-cta" type="button" onClick={onOpenWorkbench}>Explore the live workbench <span aria-hidden="true">→</span></button>
    </section>
    <footer className="landing-footer"><strong>Civora</strong><span>Built on GenLayer · Official evidence, consensus, and revision-aware state.</span></footer>
  </main>
);
