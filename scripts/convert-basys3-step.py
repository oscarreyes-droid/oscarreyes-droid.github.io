from OCP.TDocStd import TDocStd_Document
from OCP.TCollection import TCollection_ExtendedString,TCollection_AsciiString
from OCP.STEPCAFControl import STEPCAFControl_Reader
from OCP.XCAFDoc import XCAFDoc_DocumentTool
from OCP.TDF import TDF_LabelSequence
from OCP.BRepMesh import BRepMesh_IncrementalMesh
from OCP.RWGltf import RWGltf_CafWriter
from OCP.TColStd import TColStd_IndexedDataMapOfStringString
from OCP.Message import Message_ProgressRange
from OCP.Bnd import Bnd_Box
from OCP.BRepBndLib import BRepBndLib
from pathlib import Path
import argparse, tempfile, subprocess
parser=argparse.ArgumentParser(description='Convert the supplied Basys3 STEP assembly to the interactive browser model.')
parser.add_argument('step',type=Path)
parser.add_argument('--output',type=Path,default=Path(__file__).resolve().parents[1]/'models/basys3.glb')
args=parser.parse_args()
args.output.parent.mkdir(parents=True,exist_ok=True)
workspace=tempfile.TemporaryDirectory(prefix='basys3-cad-')
raw=Path(workspace.name)/'raw.glb' 

doc=TDocStd_Document(TCollection_ExtendedString('MDTV-XCAF'))
r=STEPCAFControl_Reader();r.SetColorMode(True);r.SetNameMode(True)
assert int(r.ReadFile(str(args.step)))==1
assert r.Transfer(doc)
tool=XCAFDoc_DocumentTool.ShapeTool_s(doc.Main());labels=TDF_LabelSequence();tool.GetFreeShapes(labels)
print('Root shapes:',labels.Length(),flush=True)
bounds=Bnd_Box()
for i in range(1,labels.Length()+1):
 shape=tool.GetShape_s(labels.Value(i));BRepBndLib.Add_s(shape,bounds)
 mesh=BRepMesh_IncrementalMesh(shape,.12,False,.35,True);mesh.Perform()
print('Source bounds (mm):',bounds.Get(),flush=True)
writer=RWGltf_CafWriter(TCollection_AsciiString(str(raw)),True)
info=TColStd_IndexedDataMapOfStringString()
info.Add(TCollection_AsciiString('source'),TCollection_AsciiString('User-supplied GrabCAD Basys3 STEP model'))
assert writer.Perform(doc,info,Message_ProgressRange())
subprocess.run(['node',str(Path(__file__).with_name('prepare-basys3-cad.mjs')),str(raw),str(args.output)],check=True)
workspace.cleanup()
