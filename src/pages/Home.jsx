import sixDegree from "../assets/six-degree.png";
import E_SDG_logo from "../assets/E_SDG_logo.png";
import UPR_info from "../assets/UPR-info.png";

export default function Home() {
  return (
    <div>
      <div className="">
        <div className="w-4/5 mx-auto">
          <div className="mt-2 text-center">
            <img src={sixDegree} className="img-fluid" />
          </div>
          <div className="mt-3 flex flex-col gap-3">
            <p>
              2019
              年為台灣地方創生元年，以達成「均衡台灣」為目標。而除了吸引實體人口前往鄉鎮發展外，我們同時也希望能替各鄉鎮創造數位關係人口。
            </p>
            <p>因而，數位鎮民計畫展開了。</p>
            <p>
              透過數位身份證 (eID)，您在參與結合聯合國永續發展目標 (SDGs)
              及企業社會責任 (CSR)
              的地方創生議題的同時，成為各鄉鎮的數位關係人口，各鄉鎮也形同您的第二個故鄉。而參與過程的數位足跡，都將被
              eID 記錄下來並反應您不同但真實的第二人格，形成「數位孿生」。
            </p>
            <p>
              擁有
              eID，我們將能不受地域限制地投入各鄉鎮的創生議題，您的支持也將成為第二故鄉的創生力量。
            </p>
          </div>
          <div className="mt-3 text-center">
            <img src={E_SDG_logo} className="" />
            <img src={UPR_info} className="" />
          </div>
          <div className="d-flex mt-5 mb-3 justify-content-center ">
            <a
              className="rounded-2 bg-home_button p-4 text-white no-underline hover:underline"
              href="/accounts/signin"
              role="button"
            >
              成為數位鎮民
            </a>
          </div>
        </div>
      </div>

      <div className="bg-light p-3">
        <p id="ann_cookie" className="mb-0">
          為提供您最佳的瀏覽體驗，本網站會在您的電腦中讀取並儲存使用者的Cookie。繼續瀏覽，即表示您同意隱私權政策。
          <a
            href="javascript:dis_ann_cookie();"
            className="badge badge-pill badge-primary"
          >
            確定
          </a>
        </p>
      </div>
    </div>
  );
}
