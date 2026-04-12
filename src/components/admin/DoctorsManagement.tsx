import { Doctor } from "@/generated/prisma/client";
import { useGetDoctors } from "@/hooks/use-doctors";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  EditIcon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
  StethoscopeIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Badge } from "../ui/badge";
import AddDoctorDialog from "./AddDoctorDialog";
import EditDoctorDialog from "./EditDoctorDialog";

function DoctorsManagement() {
  const { data: doctors = [] } = useGetDoctors();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const handleEditDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedDoctor(null);
  };

  return (
    <>
      <Card className="mb-12">
        <CardHeader className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
          <div>
            <CardTitle className="flex items-center gap-2">
              <StethoscopeIcon className="size-5 text-primary" />
              Doctors Management
            </CardTitle>
            <CardDescription>
              Manage and oversee all doctors in your practice
            </CardDescription>
          </div>

          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
            <PlusIcon className="mr-2 size-4" />
            Add Doctor
          </Button>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {doctors.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <StethoscopeIcon className="size-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium">No doctors added yet.</p>
                <p className="text-sm mt-1">
                  Click "Add Doctor" to get started.
                </p>
              </div>
            ) : (
              doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="flex items-center gap-4">
                    <Image
                      src={doctor.imageUrl}
                      alt={doctor.name}
                      width={48}
                      height={48}
                      className="size-12 rounded-full object-cover ring-2 ring-background"
                    />

                    <div>
                      <div className="font-semibold">{doctor.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {doctor.speciality}
                        <span className="ml-2 px-2 py-0.5 bg-muted rounded text-xs">
                          {doctor.gender === "MALE" ? "Male" : "Female"}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MailIcon className="h-3 w-3" />
                          {doctor.email}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <PhoneIcon className="h-3 w-3" />
                          {doctor.phone || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="font-semibold text-primary">
                        {doctor.appointmentCount}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Appointments
                      </div>
                    </div>

                    {doctor.isActive ? (
                      <Badge className="border border-orange-300/20 bg-orange-300/10 text-orange-200 hover:bg-orange-300/15">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 hover:scale-[1.03] transition-transform"
                      onClick={() => handleEditDoctor(doctor)}>
                      <EditIcon className="size-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AddDoctorDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />

      <EditDoctorDialog
        key={selectedDoctor?.id}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        doctor={selectedDoctor}
      />
    </>
  );
}

export default DoctorsManagement;
