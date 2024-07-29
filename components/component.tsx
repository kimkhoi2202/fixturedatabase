"use client"

import { useState, useMemo, ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowUpDown, Search } from "lucide-react"
import { Label } from "@/components/ui/label"

type DataItem = {
  id: string
  dateAdded: string
  owner: string
  coOwners: string[]
  series: string
  model: string
  brokenParts: string
}

const placeholderData: DataItem[] = [
  { id: "f12345", dateAdded: "2024-07-01", owner: "123456", coOwners: ["654321", "234567"], series: "A1", model: "X100", brokenParts: "None" },
  { id: "f67890", dateAdded: "2024-07-02", owner: "789012", coOwners: ["890123"], series: "B2", model: "Y200", brokenParts: "Screen" },
  { id: "f34567", dateAdded: "2024-07-03", owner: "345678", coOwners: [], series: "C3", model: "Z300", brokenParts: "Keyboard" }
]

const seriesOptions = ["A1", "B2", "C3"]
const modelOptions = ["X100", "Y200", "Z300"]

export default function Component() {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortColumn, setSortColumn] = useState<keyof DataItem>("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalStep, setModalStep] = useState<number>(1)
  const [modalData, setModalData] = useState<Partial<DataItem>>({})
  const [idError, setIdError] = useState<string>("")
  const [ownerError, setOwnerError] = useState<string>("")
  const [coOwnerError, setCoOwnerError] = useState<string>("")
  const [data, setData] = useState<DataItem[]>(placeholderData)

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, data])

  const sortedData = useMemo(() => {
    return filteredData.sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
      if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [filteredData, sortColumn, sortDirection])

  const handleSort = (column: keyof DataItem) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleAction = (action: string) => {
    if (action === "add") {
      setModalStep(1)
      setModalData({})
      setShowModal(true)
    }
  }

  const handleCancel = () => {
    setShowModal(false)
    setIdError("")
    setOwnerError("")
    setCoOwnerError("")
    setModalData({})
  }

  const handleNext = () => {
    if (modalStep === 1 && !/^f\d{5}$/.test(modalData.id ?? "")) {
      setIdError("ID must follow the format 'f' followed by 5 digits")
      return
    }
    if (modalStep === 2 && !/^\d{6}$/.test(modalData.owner ?? "")) {
      setOwnerError("Owner must be 6 digits")
      return
    }
    if (modalStep === 3 && modalData.coOwners?.some(coOwner => !/^\d{6}$/.test(coOwner))) {
      setCoOwnerError("Each co-owner must be 6 digits")
      return
    }
    setModalStep(modalStep + 1)
    setIdError("")
    setOwnerError("")
    setCoOwnerError("")
  }

  const handleBack = () => {
    setModalStep(modalStep - 1)
  }

  const handleSave = () => {
    const newItem: DataItem = {
      id: modalData.id ?? "",
      dateAdded: new Date().toISOString().split('T')[0],
      owner: modalData.owner ?? "",
      coOwners: modalData.coOwners ?? [],
      series: modalData.series ?? "",
      model: modalData.model ?? "",
      brokenParts: ""
    }
    setData([...data, newItem])
    setShowModal(false)
  }

  const handleCoOwnersChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setModalData({ ...modalData, coOwners: value.split(",") })
  }

  return (
    <div className="container mx-auto px-4 mt-8">
      <div className="flex justify-between items-center mb-4 space-x-4">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Search className="h-5 w-5 text-gray-500" />
          </span>
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 w-full rounded-md"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="bg-blue-500 text-white cursor-pointer">
              Action
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="cursor-pointer">
            <DropdownMenuItem className="cursor-pointer hover:bg-blue-100" onClick={() => handleAction("add")}>
              Add
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-blue-100" onClick={() => handleAction("edit")}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-blue-100" onClick={() => handleAction("delete")}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("id")} className="cursor-pointer">
                ID
                {sortColumn === "id" && <ArrowUpDown className="w-4 h-4 inline-block ml-1" />}
              </TableHead>
              <TableHead onClick={() => handleSort("dateAdded")} className="cursor-pointer">
                Date Added
                {sortColumn === "dateAdded" && <ArrowUpDown className="w-4 h-4 inline-block ml-1" />}
              </TableHead>
              <TableHead onClick={() => handleSort("owner")} className="cursor-pointer">
                Owner
                {sortColumn === "owner" && <ArrowUpDown className="w-4 h-4 inline-block ml-1" />}
              </TableHead>
              <TableHead onClick={() => handleSort("coOwners")} className="cursor-pointer">
                Co-owners
                {sortColumn === "coOwners" && <ArrowUpDown className="w-4 h-4 inline-block ml-1" />}
              </TableHead>
              <TableHead onClick={() => handleSort("series")} className="cursor-pointer">
                Series
                {sortColumn === "series" && <ArrowUpDown className="w-4 h-4 inline-block ml-1" />}
              </TableHead>
              <TableHead onClick={() => handleSort("model")} className="cursor-pointer">
                Model
                {sortColumn === "model" && <ArrowUpDown className="w-4 h-4 inline-block ml-1" />}
              </TableHead>
              <TableHead onClick={() => handleSort("brokenParts")} className="cursor-pointer">
                Broken Parts
                {sortColumn === "brokenParts" && <ArrowUpDown className="w-4 h-4 inline-block ml-1" />}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.dateAdded}</TableCell>
                <TableCell>{item.owner}</TableCell>
                <TableCell>{item.coOwners.join(", ")}</TableCell>
                <TableCell>{item.series}</TableCell>
                <TableCell>{item.model}</TableCell>
                <TableCell>{item.brokenParts}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={showModal} onOpenChange={(open) => setShowModal(open)}>
        <DialogContent className="transition-transform duration-300 bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
          </DialogHeader>
          {modalStep === 1 && (
            <div className="relative mb-4">
              <Label htmlFor="id" className="block text-sm font-medium text-gray-700">ID</Label>
              <Input
                id="id"
                placeholder="f12345"
                value={modalData.id ?? ""}
                onChange={(e) => setModalData({ ...modalData, id: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {idError && <div className="text-red-500 text-sm mt-1">{idError}</div>}
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleNext}>Next</Button>
              </div>
            </div>
          )}
          {modalStep === 2 && (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Label htmlFor="owner" className="block text-sm font-medium text-gray-700">Owner</Label>
                <Input
                  id="owner"
                  placeholder="Owner"
                  value={modalData.owner ?? ""}
                  onChange={(e) => setModalData({ ...modalData, owner: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {ownerError && <div className="text-red-500 text-sm mt-1">{ownerError}</div>}
              </div>
              <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={handleBack}>Back</Button>
                <Button onClick={handleNext}>Next</Button>
              </div>
            </div>
          )}
          {modalStep === 3 && (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Label htmlFor="coOwners" className="block text-sm font-medium text-gray-700">Co-owners (optional)</Label>
                <Input
                  id="coOwners"
                  placeholder="Co-owners (separated by commas)"
                  value={modalData.coOwners?.join(", ") ?? ""}
                  onChange={handleCoOwnersChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {coOwnerError && <div className="text-red-500 text-sm mt-1">{coOwnerError}</div>}
              </div>
              <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={handleBack}>Back</Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleNext}>Skip</Button>
                  <Button onClick={handleNext}>Next</Button>
                </div>
              </div>
            </div>
          )}
          {modalStep === 4 && (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Label htmlFor="series" className="block text-sm font-medium text-gray-700">Series</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-black hover:bg-white">
                      {modalData.series ?? "Select Series"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {seriesOptions.map((series) => (
                      <DropdownMenuItem key={series} onClick={() => setModalData({ ...modalData, series })}>
                        {series}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex justify-between gap-2 mt-4">
                <Button variant="outline" onClick={handleBack}>Back</Button>
                <Button onClick={handleNext}>Next</Button>
              </div>
            </div>
          )}
          {modalStep === 5 && (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-black hover:bg-white">
                      {modalData.model ?? "Select Model"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {modelOptions.map((model) => (
                      <DropdownMenuItem key={model} onClick={() => setModalData({ ...modalData, model })}>
                        {model}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex justify-between gap-2 mt-4">
                <Button variant="outline" onClick={handleBack}>Back</Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
