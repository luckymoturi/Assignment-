import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { ProductService } from "./ProductService";

interface Artwork {
  id: string;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: string;
  date_end: string;
}

export default function BasicDemo() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [rowClick] = useState<boolean>(true);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [selectCount, setSelectCount] = useState<number>(0);

  const overlayRef = useRef<OverlayPanel>(null);

  const fetchArtworks = async (page: number, size: number) => {
    const data = await ProductService.getArtworks(page, size);
    setArtworks(data.artworks);
    setTotalRecords(data.total);
  };

  useEffect(() => {
    fetchArtworks(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  const onPageChange = (event: {
    first: number;
    rows: number;
    page: number | undefined;
  }) => {
    if (event.page !== undefined) {
      const newPage = event.page + 1;
      setCurrentPage(newPage);
      fetchArtworks(newPage, rowsPerPage);
    }

    if (event.rows !== undefined) {
      setRowsPerPage(event.rows);
      console.log("Rows changed:", event.rows);
      fetchArtworks(1, event.rows);
    }
  };

  const selectRows = () => {
    const count = Math.min(selectCount, artworks.length);
    const selected = artworks.slice(0, count);
    setSelectedArtworks(selected);
    overlayRef.current?.hide();
  };

  const sortertworks = [
    ...artworks.filter((artwork) => selectedArtworks.includes(artwork)),
    ...artworks.filter((artwork) => !selectedArtworks.includes(artwork)),
  ];

  return (
    <div className="card">
      <DataTable
        value={sortertworks}
        paginator
        rows={rowsPerPage}
        totalRecords={totalRecords}
        lazy
        onPage={onPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "50rem" }}
        selectionMode={rowClick ? null : "checkbox"}
        selection={selectedArtworks}
        onSelectionChange={(e: { value: Artwork[] | null }) => {
          setSelectedArtworks(e.value || []);
        }}
        dataKey="id"
        paginatorClassName="custom-paginator"
      >
        <Column
          header={() => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <button
                onClick={(e) => overlayRef.current?.toggle(e)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
              >
                &#9660;
              </button>

              <OverlayPanel ref={overlayRef}>
                <div>
                  <input
                    type="number"
                    min="1"
                    max={artworks.length}
                    value={selectCount}
                    onChange={(e) => setSelectCount(Number(e.target.value))}
                    placeholder="Select rows..."
                  />
                  <button onClick={selectRows}>Submit</button>
                </div>
              </OverlayPanel>
            </div>
          )}
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
          bodyStyle={{ textAlign: "center" }}
          style={{ textAlign: "center" }}
        ></Column>

        <Column field="title" header="Title" style={{ width: "25%" }}></Column>
        <Column
          field="place_of_origin"
          header="Place of Origin"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="artist_display"
          header="Artist Display"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="inscriptions"
          header="Inscriptions"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="date_start"
          header="Date Start"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="date_end"
          header="Date End"
          style={{ width: "25%" }}
        ></Column>
      </DataTable>
    </div>
  );
}
