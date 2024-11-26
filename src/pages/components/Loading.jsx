import Loading from "../../assets/loading.png";

export default function LoadingModal() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="flex justify-center items-center">
        <img src={Loading} alt="loading" className="animate-spin w-16 h-16" />
      </div>
    </div>
  );
}
