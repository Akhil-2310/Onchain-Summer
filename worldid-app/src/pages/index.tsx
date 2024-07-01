import { VerificationLevel, IDKitWidget } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import type { VerifyReply } from "./api/verify";

export default function Home() {
	if (!process.env.NEXT_PUBLIC_WLD_APP_ID) {
		throw new Error("app_id is not set in environment variables!");
	}
	if (!process.env.NEXT_PUBLIC_WLD_ACTION) {
		throw new Error("app_id is not set in environment variables!");
	}

	const onSuccess = (result: ISuccessResult) => {
		console.log(JSON.stringify(result))
		const urlParams = new URLSearchParams(window.location.search);
		const callbackUrl = urlParams.get('callbackUrl'); // get callback URL from URL parameters
		const address = urlParams.get('address');
		const sessionId = urlParams.get('sessionId');
		if (callbackUrl) {
			fetch(callbackUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					address,
					sessionId,
					worldcoinResponse: result,
				}),
			})
				.then(response => response.json())
				.then(data => { console.log(data); window.close() })
				.catch((error) => {
					console.error('Error:', error);
					window.close()
				});
		} else {
			console.error('Error: callbackUrl parameter is missing in the URL');
		}
	};

	const handleProof = async (result: ISuccessResult) => {
		console.log("Proof received from IDKit:\n", JSON.stringify(result)); // Log the proof from IDKit to the console for visibility
		const reqBody = {
			merkle_root: result.merkle_root,
			nullifier_hash: result.nullifier_hash,
			proof: result.proof,
			verification_level: result.verification_level,
			action: process.env.NEXT_PUBLIC_WLD_ACTION,
			signal: "",
		};
		console.log("Sending proof to backend for verification:\n", JSON.stringify(reqBody)) // Log the proof being sent to our backend for visibility
		const res: Response = await fetch("/api/verify", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(reqBody),
		})
		const data: VerifyReply = await res.json()
		if (res.status == 200) {
			console.log("Successful response from backend:\n", data); // Log the response from our backend for visibility
		} else {
			throw new Error(`Error code ${res.status} (${data.code}): ${data.detail}` ?? "Unknown error."); // Throw an error if verification fails
		}
	};

	return (
		<div>
			<div className="flex flex-col items-center justify-center align-middle h-screen">
				<p className="text-2xl mb-5">Airdroppify World ID Verification</p>
				<p>Please verify your World ID to claim airdrops.</p>
				<br />
				<p>After verifying your World ID, you can close this window.</p>
				<br />
				<IDKitWidget
					action={process.env.NEXT_PUBLIC_WLD_ACTION!}
					app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`}
					onSuccess={onSuccess}
					handleVerify={handleProof}
					verification_level={VerificationLevel.Orb} // Change this to VerificationLevel.Device to accept Orb- and Device-verified users
				>
					{({ open }) =>
						<button className="border border-black rounded-md" onClick={open}>
							<div className="mx-3 my-1">Verify with World ID</div>
						</button>
					}
				</IDKitWidget>
			</div>
		</div>
	);
}
