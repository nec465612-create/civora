# Studio Dev network and deployment

| Field | Value |
| --- | --- |
| Network | GenLayer Studio Next development preview |
| SDK chain | `studioDevnet` |
| CLI preset | `studio-dev` |
| Chain ID | `61997` (`0xf22d`) |
| RPC | `https://studio-dev.genlayer.com/api` |
| Explorer | `https://explorer-studio-dev.genlayer.com` |
| GenVM | `v0.6.0-rc5` |
| Contract dependency | `py-genlayer:5jycge4q8k23462jtb0b9fyey1s9qz928sz2nbrd9mg4sxqg2qng` |
| Contract | `0x12c037C1F985c6f852bAbBc9F6ed6AfCd4342182` |
| Deployment transaction | [`0x931797…e8e1`](https://explorer-studio-dev.genlayer.com/tx/0x931797897c9665c6dee1799a962b2b84089bc7a4ee9a5f85b95b3c644962e8e1) |
| Deployed source commit | `2c8c4c334bc3ae3a285eacab98f5a93087138dc4` |
| Source SHA-256 | `6C47353E90347AF9C7B3AACD37CD2E9371FBE6D8532CF48843F26646CB665646` |

Studio Next is configured explicitly. The application does not select stable `studionet` and override its RPC or consensus addresses.

The deployment receipt was `FINALIZED` with semantic `FINISHED_WITH_RETURN`, leader `SUCCESS`, and `MAJORITY_AGREE`. `gen_getContractCode` returned the exact 56,832 source bytes. `get_upgrader` returned the locked actor, and the initial trigger count was zero. The complete transaction/readback matrix is in [VERIFICATION.md](VERIFICATION.md).

Studio Dev is selected directly; this app does not point a stable Studionet client at the development RPC. If chain state resets, the address and state cannot be assumed to survive: redeploy from the recorded source, rerun the live matrix, and update the website configuration.
