import { useState, useEffect } from "react";
import { MessageSquare, Check, Search } from "lucide-react";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

import { format } from "date-fns";
import { toast } from "sonner";

const ComplaintCard = ({
  complaint,
  openDialogId,
  setOpenDialogId,
  resolution,
  setResolution,
  handleResolve
}) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-lg">
            Complaint #{complaint._id}
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Customer: {complaint.customerName}
          </p>
          <p className="text-sm text-gray-600">
            Order: {complaint.orderId}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {format(new Date(complaint.date), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        <Badge
          className={
            complaint.status === "open"
              ? "bg-red-500"
              : "bg-green-500"
          }
        >
          {complaint.status}
        </Badge>
      </div>
    </CardHeader>

    <CardContent className="space-y-4">
      <div>
        <p className="text-sm font-semibold mb-1">
          Complaint Message
        </p>
        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
          {complaint.message}
        </p>
      </div>

      {complaint.status === "open" ? (
        <Dialog
          open={openDialogId === complaint._id}
          onOpenChange={(open) => {
            if (open) {
              setOpenDialogId(complaint._id);
              setResolution("");
            } else {
              setOpenDialogId(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full bg-blue-500 hover:bg-blue-600">
              <Check className="w-4 h-4 mr-2" />
              Resolve Complaint
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Resolve Complaint
              </DialogTitle>
              <DialogDescription>
                Provide resolution details for this customer.
              </DialogDescription>
            </DialogHeader>

            <Textarea
              placeholder="Type resolution details here..."
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={4}
            />

            <DialogFooter>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => handleResolve(complaint._id)}
              >
                Mark Resolved
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="space-y-3">
          <div className="bg-green-50 p-3 rounded border border-green-100">
            <p className="text-xs font-bold text-green-800 uppercase mb-1">
              Resolution
            </p>
            <p className="text-sm text-green-700">
              {complaint.resolution || "No resolution details provided."}
            </p>
          </div>
          <Badge className="bg-green-500 w-full py-2 justify-center">
            <Check className="w-4 h-4 mr-2" />
            Resolved
          </Badge>
        </div>
      )}
    </CardContent>
  </Card>
);

export function Complaints() {

  const [complaints, setComplaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [resolution, setResolution] = useState("");
  const [openDialogId, setOpenDialogId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {

    axios
      .get("http://localhost:5000/api/complaints", {
        headers: {
          authorization: token
        }
      })
      .then((res) => {
        setComplaints(res.data);
      })
      .catch((err) => console.log(err));

  }, [token]);


  const filteredComplaints = complaints.filter(

    (complaint) =>

      complaint.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||

      complaint.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||

      complaint.message.toLowerCase().includes(searchQuery.toLowerCase())

  );


  const openComplaints = filteredComplaints.filter((c) => c.status === "open");

  const resolvedComplaints = filteredComplaints.filter((c) => c.status === "resolved");


  const handleResolve = async (complaintId) => {
    if (!resolution.trim()) {
      toast.error("Please provide resolution details");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/complaints/${complaintId}/resolve`,
        { resolution },
        {
          headers: {
            authorization: token
          }
        }
      );

      setComplaints(
        complaints.map((complaint) =>
          complaint._id === complaintId
            ? response.data
            : complaint
        )
      );

      setResolution("");
      setOpenDialogId(null);
      toast.success("Complaint resolved successfully!");
    } catch (error) {
      toast.error("Failed to resolve complaint");
    }
  };


  return (

    <div>

      <div className="mb-6">

        <h1 className="text-3xl font-bold mb-2">
          Complaint Management
        </h1>

        <p className="text-gray-600">
          Handle customer complaints
        </p>

      </div>


      <div className="mb-6">

        <div className="relative max-w-md">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

          <Input
            placeholder="Search complaints..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

        </div>

      </div>


      <Tabs defaultValue="open">

        <TabsList>

          <TabsTrigger value="open">
            Open
          </TabsTrigger>

          <TabsTrigger value="resolved">
            Resolved
          </TabsTrigger>

        </TabsList>


        <TabsContent value="open" className="mt-6">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {openComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint._id}
                complaint={complaint}
                openDialogId={openDialogId}
                setOpenDialogId={setOpenDialogId}
                resolution={resolution}
                setResolution={setResolution}
                handleResolve={handleResolve}
              />
            ))}

          </div>

        </TabsContent>


        <TabsContent value="resolved" className="mt-6">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {resolvedComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint._id}
                complaint={complaint}
                openDialogId={openDialogId}
                setOpenDialogId={setOpenDialogId}
                resolution={resolution}
                setResolution={setResolution}
                handleResolve={handleResolve}
              />
            ))}

          </div>

        </TabsContent>

      </Tabs>

    </div>

  );

}