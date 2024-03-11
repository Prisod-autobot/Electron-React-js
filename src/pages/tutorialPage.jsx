import React from "react";

const TutorialPage = () => {
	return (
		<div className="container mx-auto px-4 pb-8 pt-2">
			<h1 className="text-xl md:text-2xl font-bold mb-4">
				Bot Trading with Bybit
			</h1>

			<div className="mb-6">
				<h2 className="text-lg md:text-xl font-semibold">
					Understanding API Keys
				</h2>
				<p className="mt-2">
					API keys and secret keys are essential for secure
					communication between your bot and Bybit. Your{" "}
					<strong>API key</strong> acts as a unique identifier, while
					the <strong>secret key</strong> authenticates requests. Keep
					your secret key private!
				</p>

				<div className="mt-4">
					<h3 className="text-base font-semibold">
						How to Obtain Your Keys
					</h3>
					<ul className="mt-2 list-disc ml-6">
						<li>Create a Bybit account.</li>
						<li>Navigate to your API settings.</li>
						<li>Generate a new API key pair.</li>
					</ul>
				</div>
			</div>

			<div className="mt-6">
				<h2 className="text-lg md:text-xl font-semibold">
					Grid Trading
				</h2>
				<img
					src="Grid-trading.webp"
					alt="Grid Trading Diagram"
					className="mt-4 w-full max-w-md mx-auto"
				/>
				<p className="mt-2">
					Grid trading involves placing buy/sell orders at set
					intervals within a price range. This strategy profits from
					market fluctuations.
				</p>
			</div>

			<div className="mt-6">
				<h2 className="text-lg md:text-xl font-semibold">
					Rebalance Trading
				</h2>
				<img
					src="ReBalance.webp"
					alt="Rebalancing Chart"
					className="mt-4 w-full max-w-md mx-auto"
				/>
				<p className="mt-2">
					Rebalance trading automatically adjusts your portfolio's
					asset allocation to maintain your desired risk profile.
				</p>
			</div>

			<div className="mt-6">
				<h2 className="text-lg md:text-xl font-semibold">
					QTY and Budget
				</h2>
				<p className="mt-2">
					<strong>QTY:</strong> The amount of cryptocurrency traded
					per grid order.
				</p>
				<p className="mt-2">
					<strong>Budget:</strong> Total capital allocated to the bot.
				</p>
			</div>

			<div className="mt-6">
				<h2 className="text-lg md:text-xl font-semibold">
					Risk Management
				</h2>
				<ul className="mt-2 list-disc ml-6">
					<li>Use stop-loss orders to limit losses.</li>
					<li>Start small and test your strategies.</li>
					<li>Diversify with bots on different trading pairs.</li>
				</ul>
			</div>
		</div>
	);
};

export default TutorialPage;
