import axiosClient from "./axiosClient";

export const PaymentsAPI = {
  getResidentWallets: () => axiosClient.get("payments/resident-wallets/"),
  getBuildingWallets: () => axiosClient.get("payments/building-wallets/"),
  getTechnicianWallets: () => axiosClient.get("payments/technician-wallets/"),

  createTopup: (data) => axiosClient.post("payments/topups/", data),
  initiateTopup: (id) =>
    axiosClient.post(`payments/topups/${id}/initiate_topup/`),

  getInvoices: () => axiosClient.get("payments/invoices/"),

  sahelInquiry: (bill_number) =>
    axiosClient.post("payments/sahel/inquire/", { bill_number }),
  sahelPay: (bill_number, amount) =>
    axiosClient.post("payments/sahel/pay/", { bill_number, amount }),
};

export const getWallet = () => axiosClient.get("payments/wallets/me/");
export const initiateTopUp = (data) => axiosClient.post("payments/topups/", data);
export const getTransactions = () => axiosClient.get("payments/transactions/");
export const getUnpaidInvoices = () => axiosClient.get("packages/invoices/unpaid/");
export const payInvoice = (id) => axiosClient.post(`packages/invoices/${id}/pay/`);
