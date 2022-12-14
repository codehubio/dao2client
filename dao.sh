#/usr/bin/sh
export DEBUG_DEPTH=4
echo "Checking for ts-node"
echo "ts-node is located at $(which ts-node)"
TS_NODE=$(which ts-node)
ACTION=$1
for ARGUMENT in "${@:2}"
do
   KEY=$(echo $ARGUMENT | cut -f1 -d=)

   KEY_LENGTH=${#KEY}
   VALUE="${ARGUMENT:$KEY_LENGTH+1}"

   export "$KEY"="$VALUE"
done
PARAMETERS="";
if [ $ACTION == "create-proposal" ]; then
   PARAMETERS="id=$id name=$name description=$description expireOrFinalizeAfter=$expireOrFinalizeAfter"
elif [ $ACTION == "add-step" ]; then
   PARAMETERS="incentiveRate=$incentiveRate name=$name description=$description amount=$amount sender=$sender receiver=$receiver token=$token executeAfter=$executeAfter proposalId=$proposalId"
elif [ $ACTION == "get-proposal-by-id" ]; then
   PARAMETERS="proposalId=$proposalId"
elif [ $ACTION == "settle-proposal" ]; then
   PARAMETERS="proposalId=$proposalId"
elif [ $ACTION == "approve-step" ]; then
   PARAMETERS="proposalId=$proposalId stepIndex=${stepIndex} approvedAmount=${approvedAmount}"
elif [ $ACTION == "reject-step" ]; then
   PARAMETERS="proposalId=$proposalId stepIndex=${stepIndex} reason=${reason}"
elif [ $ACTION == "execute-step" ]; then
   PARAMETERS="proposalId=$proposalId stepIndex=${stepIndex}"
elif [ $ACTION == "revert-step" ]; then
   PARAMETERS="proposalId=$proposalId stepIndex=${stepIndex} approvalIndex=${approvalIndex}"
fi
echo "run $1 with $PARAMETERS"
export DEBUG=*&&$TS_NODE ./cli/$ACTION $PARAMETERS 