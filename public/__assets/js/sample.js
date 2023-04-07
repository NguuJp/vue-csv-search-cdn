const storeListVolume = 100000; // 店舗リストの件数
const csvSorce = `__assets/data/store_list_${storeListVolume}.csv`; // CSVファイルのパス
const viewStoreList = 100; // 1ページあたりの表示件数


new Vue({
  el: "#app",
  data() {
    return {
      loading: true, // ローディングのステータス
      stores: [], // すべての店舗データ
      displayedStoresStatus: true, // 店舗データのステータス
      isFiltered: false, // フィルターされているかどうか
      displayedStores: [], // 表示される店舗データ
      filteredStores: [], // フィルターされた店舗データ
      areas: [], // エリアリスト
      genres: [], // ジャンルリスト
      search: {
        name: "",
        address: "",
        genre: "",
        payAu: false, // au PAYを検索対象に含めるかどうか
        payDocomo: false, // d払いを検索対象に含めるかどうか
        payPayPay: false, // PayPayを検索対象に含めるかどうか
        payRakuten: false, // 楽天ペイを検索対象に含めるかどうか
        keyword: "",
      },
      currentPage: 1, // 現在のページの初期値
      pageCount: 0, // ページ数の初期値
      itemsPerPage: viewStoreList, // 1ページあたりの表示件数
      rangeLength: 5, // ページネーションの表示範囲
    };
  },
  computed: {
    pages() {
      let start = Math.max(1, this.currentPage - this.rangeLength);
      let end = Math.min(this.pageCount, this.currentPage + this.rangeLength);
      let range = [];
      if (start > 1) {
        range.push(1);
        if (start > 2) {
          range.push({ text: "...", disabled: true });
        }
      }
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      if (end < this.pageCount) {
        if (end < this.pageCount - 1) {
          range.push({ text: "...", disabled: true });
        }
        range.push(this.pageCount);
      }
      return range;
    },
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
      console.log(this.currentPage);
      this.filter(); // ページが変更された時に filter() メソッドを呼び出す
      console.log(this.currentPage);
      const start = (page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      this.displayedStores = this.filteredStores.slice(start, end);
    },
    filter() {
      this.isFiltered = true;
      let filteredStores = this.stores.filter((store) => {
        let nameMatch = true;
        let areaMatch = true;
        let addressMatch = true;
        let genreMatch = true;
        let keywordMatch = true;
        let payAuMatch = true;
        let payDocomoMatch = true;
        let payPayPayMatch = true;
        let payRakutenMatch = true;
        if (this.search.name) {
          nameMatch = store.name
            .toLowerCase()
            .includes(this.search.name.toLowerCase());
        }
        if (this.search.area) {
          areaMatch = store.area === this.search.area;
        }
        if (this.search.address) {
          addressMatch = store.address
            .toLowerCase()
            .includes(this.search.address.toLowerCase());
        }
        if (this.search.genre) {
          genreMatch = store.genre === this.search.genre;
        }
        if (this.search.keyword) {
          const keyword = this.search.keyword.toLowerCase();
          keywordMatch = Object.values(store).some((value) =>
            value.toLowerCase().includes(keyword)
          );
        }
        if (this.search.payAu) {
          payAuMatch = store.payAu === "●";
        }
        if (this.search.payDocomo) {
          payDocomoMatch = store.payDocomo === "●";
        }
        if (this.search.payPayPay) {
          payPayPayMatch = store.payPayPay === "●";
        }
        if (this.search.payRakuten) {
          payRakutenMatch = store.payRakuten === "●";
        }

        return (
          nameMatch &&
          areaMatch &&
          addressMatch &&
          genreMatch &&
          keywordMatch &&
          payAuMatch &&
          payDocomoMatch &&
          payPayPayMatch &&
          payRakutenMatch
        );
      });

      // フィルタリング後の店舗数が 0 の場合
      if (filteredStores.length === 0) {
        this.displayedStores = [];
        // console.log("該当する店舗が見つかりませんでした");
        this.displayedStoresStatus = false;
        // console.log(this.displayedStoresStatus);
        this.filteredStores = [];
        return;
      } else {
        this.displayedStoresStatus = true;
        // console.log(this.displayedStoresStatus);
        this.filteredStores = filteredStores || [];
        this.pageCount = Math.ceil(
          this.filteredStores.length / this.itemsPerPage
        );
        this.displayedStores = this.filteredStores.slice(0, this.itemsPerPage);
      }
    },
    // 検索フォームをリセットする
    resetSearch() {
      this.search = {
        name: "",
        area: "",
        address: "",
        genre: "",
        payAu: false,
        payDocomo: false,
        payPayPay: false,
        payRakuten: false,
        keyword: "",
      };
    },
  },

  mounted() {
    axios
      .get(csvSorce)
      .then((response) => {
        this.loading = true;
        const stores = response.data;
        const lines = stores.split("\n");
        const headers = lines[0].split(",");
        const newStores = [];
        for (let i = 1; i < lines.length; i++) {
          const obj = {};
          const currentline = lines[i].split(",");
          const keyMap = {
            番号: "id",
            店名: "name",
            町名: "area",
            住所: "address",
            "au PAY": "payAu",
            d払い: "payDocomo",
            PayPay: "payPayPay",
            楽天ペイ: "payRakuten",
            "ジャンル\r": "genre",
            // ... 他のキーもあれば追加
          };
          for (let j = 0; j < headers.length; j++) {
            if (headers[j] in keyMap) {
              obj[keyMap[headers[j]]] = currentline[j];
            } else {
              obj[headers[j]] = currentline[j];
            }
          }

          newStores.push(obj);
        }
        this.stores = newStores;
        this.displayedStores = this.stores.slice(0, this.itemsPerPage); // 初期表示される店舗データ
        this.pageCount = Math.ceil(this.stores.length / this.itemsPerPage); // ページ数
        this.areas = [...new Set(newStores.map((store) => store.area))];
        this.genres = [...new Set(newStores.map((store) => store.genre))];
        this.loading = false;
      })
      .catch((error) => {
        console.error(error);
      });
  },
});


