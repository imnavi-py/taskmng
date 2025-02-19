import { PrismaService } from '~/common/modules/prisma/prisma.service'

export async function updateAgentField(
  prisma: PrismaService,
  agentId: number,
  status: 'ok' | 'faild',
  fileResponse?: Buffer | null
): Promise<void> {
  await prisma.agent.update({
    where: { id: agentId },
    data: { status, file_response: fileResponse || null }
  })
}
