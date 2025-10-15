import { useState } from "react";
import { RequestOut } from "../../components/requestTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { TextArea } from "../ui/text-area";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: "approved" | "rejected", comment?: string) => void;
  request: RequestOut;
  action: "approve" | "reject";
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  request,
  action,
}) => {
  const [comment, setComment] = useState("");
  const [addComment, setAddComment] = useState(false);

  const handleSubmit = () => {
    const status: "approved" | "rejected" =
      action === "approve" ? "approved" : "rejected";
    onConfirm(status, addComment ? comment : undefined);
    setComment("");
    setAddComment(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl bg-white shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-semibold">
            {action === "approve"
              ? " Aprobar Solicitud"
              : " Rechazar Solicitud"}
          </DialogTitle>
          <DialogDescription className="mt-2 text-gray-600">
            ¿Deseas agregar un comentario a la solicitud de{" "}
            <strong className="text-gray-800">{request.full_name}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="addComment"
              checked={addComment}
              onCheckedChange={(checked) => setAddComment(!!checked)}
            />
            <Label htmlFor="addComment" className="text-gray-700">
              Agregar comentario
            </Label>
          </div>

          {addComment && (
            <TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe tu comentario aquí..."
              className="resize-none"
              rows={5}
            />
          )}
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className={`${
              action === "approve"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            } text-white shadow-md`}
            onClick={handleSubmit}
          >
            {action === "approve" ? " Aprobar" : "Rechazar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
