const SendAMess = () => {
    const message = `שלום, מדברים מ IFLIGHT\n`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
};

export default SendAMess;
