(function () {
  if (window.__TPAY_LOCAL_ETH__) return;
  window.__TPAY_LOCAL_ETH__ = true;

  var address = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0";
  var provider = {
    isMetaMask: true,
    isTrust: true,
    selectedAddress: address,
    chainId: "0x1",
    request: function (args) {
      var method = args && args.method;
      if (method === "eth_requestAccounts" || method === "eth_accounts") {
        return Promise.resolve([address]);
      }
      if (method === "eth_chainId") return Promise.resolve("0x1");
      if (method === "wallet_switchEthereumChain" || method === "wallet_addEthereumChain") {
        return Promise.resolve(null);
      }
      if (method === "personal_sign" || method === "eth_signTypedData_v4") {
        return Promise.resolve("0x" + "00".repeat(65));
      }
      return Promise.resolve(null);
    },
    on: function () {},
    removeListener: function () {},
    enable: function () {
      return provider.request({ method: "eth_requestAccounts" });
    },
  };

  if (!window.ethereum) {
    window.ethereum = provider;
  }
})();